import { useEffect, useState } from "react";
import { FaPoll, FaPlus, FaTimes, FaCheck } from "react-icons/fa";
import pollsService from "../services/pollsService";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/common/Skeleton";
import Toast from "../components/common/Toast";
import "./Polls.css";

const Polls = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const [question, setQuestion] = useState("");
  const [optionInputs, setOptionInputs] = useState(["", ""]);

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    setLoading(true);
    try {
      const res = await pollsService.getPolls();
      setPolls(res?.data ?? []);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load polls." });
    } finally {
      setLoading(false);
    }
  };

  const myVoteIndex = (poll) => {
    if (!user) return null;
    const idx = poll.options.findIndex((o) => o.voterIds.includes(user.id));
    return idx === -1 ? null : idx;
  };

  const totalVotes = (poll) => poll.options.reduce((sum, o) => sum + o.voterIds.length, 0);

  const handleVote = async (pollId, optionIndex) => {
    setVotingId(pollId);
    try {
      const res = await pollsService.vote(pollId, optionIndex);
      setPolls((prev) => prev.map((p) => (p._id === pollId ? res.data : p)));
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not submit vote." });
    } finally {
      setVotingId(null);
    }
  };

  const updateOption = (index, value) => {
    setOptionInputs((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  const addOption = () => setOptionInputs((prev) => [...prev, ""]);

  const canSubmit =
    question.trim().length > 0 &&
    optionInputs.map((o) => o.trim()).filter(Boolean).length >= 2;

  const handleCreate = async (e) => {
    e.preventDefault();
    const cleanOptions = optionInputs.map((o) => o.trim()).filter(Boolean);
    if (!canSubmit) {
      setToast({ show: true, type: "error", message: "A question and at least 2 options are required." });
      return;
    }

    setCreating(true);
    try {
      const res = await pollsService.createPoll(question.trim(), cleanOptions);
      setPolls((prev) => [res.data, ...prev]);
      setQuestion("");
      setOptionInputs(["", ""]);
      setShowForm(false);
      setToast({ show: true, type: "success", message: "Poll created." });
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not create poll." });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="polls-page">
      <div className="polls-header">
        <div>
          <h1>
            <FaPoll /> Polls
          </h1>
          <p>Vote on active polls, or ask something new.</p>
        </div>
        <button className="polls-create-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> New Poll
        </button>
      </div>

      {loading ? (
        <Skeleton variant="card" count={4} />
      ) : polls.length === 0 ? (
        <div className="polls-empty">
          <FaPoll size={40} />
          <p>No active polls. Ask something.</p>
        </div>
      ) : (
        <div className="polls-list">
          {polls.map((poll) => {
            const votedIndex = myVoteIndex(poll);
            const total = totalVotes(poll);
            const isVoting = votingId === poll._id;

            return (
              <div className="poll-card" key={poll._id}>
                <h3>{poll.question}</h3>

                {poll.options.map((option, index) => {
                  const pct = total > 0 ? Math.round((option.voterIds.length / total) * 100) : 0;
                  const isMyVote = votedIndex === index;

                  return (
                    <button
                      key={index}
                      className={isMyVote ? "poll-option active" : "poll-option"}
                      onClick={() => handleVote(poll._id, index)}
                      disabled={isVoting}
                    >
                      <span className="poll-option-fill" style={{ width: `${pct}%` }} />
                      <span className="poll-option-content">
                        <span className="poll-option-text">
                          {option.text} {isMyVote && <FaCheck size={11} />}
                        </span>
                        <span className="poll-option-pct">{pct}%</span>
                      </span>
                    </button>
                  );
                })}

                <span className="poll-vote-count">
                  {total} vote{total === 1 ? "" : "s"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="polls-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="polls-modal" onClick={(e) => e.stopPropagation()}>
            <div className="polls-modal-header">
              <h2>New Poll</h2>
              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreate} className="polls-form">
              <div className="polls-form-group">
                <label>Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What do you want to ask?"
                  required
                />
              </div>

              {optionInputs.map((value, index) => (
                <div className="polls-form-group" key={index}>
                  <label>Option {index + 1}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}

              <button type="button" className="polls-add-option-btn" onClick={addOption}>
                + Add another option
              </button>

              <button className="polls-submit-btn" type="submit" disabled={!canSubmit || creating}>
                {creating ? "Creating..." : "Create Poll"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default Polls;
