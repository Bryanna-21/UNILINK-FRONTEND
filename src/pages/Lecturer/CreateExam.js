  return (
    <div className="create-exam-page">

      <div className="page-header">
        <div>
          <h1>Create Exam</h1>
          <p>Create and publish exams for your students.</p>
        </div>
      </div>

      <div className="exam-form">

        <div className="form-section">

          <label>Exam Title</label>

          <input
            type="text"
            className="form-control"
            placeholder="Introduction to Programming CAT 1"
            value={exam.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
          />

        </div>

        <div className="form-section">

          <label>Description</label>

          <textarea
            className="form-control"
            rows={4}
            placeholder="Exam description..."
            value={exam.description}
            onChange={(e) =>
              updateField("description", e.target.value)
            }
          />

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>Course</label>

            <input
              type="text"
              className="form-control"
              placeholder="Computer Science"
              value={exam.course}
              onChange={(e) =>
                updateField("course", e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Unit</label>

            <input
              type="text"
              className="form-control"
              placeholder="CSC 210"
              value={exam.unit}
              onChange={(e) =>
                updateField("unit", e.target.value)
              }
            />

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>Duration (Minutes)</label>

            <input
              type="number"
              className="form-control"
              value={exam.duration}
              onChange={(e) =>
                updateField(
                  "duration",
                  Number(e.target.value)
                )
              }
            />

          </div>

          <div className="form-group">

            <label>Start Time</label>

            <input
              type="datetime-local"
              className="form-control"
              value={exam.startTime}
              onChange={(e) =>
                updateField("startTime", e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>End Time</label>

            <input
              type="datetime-local"
              className="form-control"
              value={exam.endTime}
              onChange={(e) =>
                updateField("endTime", e.target.value)
              }
            />

          </div>

        </div>

        <div className="form-section">

          <label>Instructions</label>

          <textarea
            rows={5}
            className="form-control"
            placeholder="Enter exam instructions..."
            value={exam.instructions}
            onChange={(e) =>
              updateField(
                "instructions",
                e.target.value
              )
            }
          />

        </div>

        <div className="checkbox-grid">

          <label>

            <input
              type="checkbox"
              checked={exam.allowRetake}
              onChange={(e) =>
                updateField(
                  "allowRetake",
                  e.target.checked
                )
              }
            />

            Allow Retake

          </label>

          <label>

            <input
              type="checkbox"
              checked={exam.shuffleQuestions}
              onChange={(e) =>
                updateField(
                  "shuffleQuestions",
                  e.target.checked
                )
              }
            />

            Shuffle Questions

          </label>

          <label>

            <input
              type="checkbox"
              checked={
                exam.showResultsImmediately
              }
              onChange={(e) =>
                updateField(
                  "showResultsImmediately",
                  e.target.checked
                )
              }
            />

            Show Results Immediately

          </label>

        </div>

        <QuestionBuilder
          questions={exam.questions}
          setQuestions={(questions) =>
            updateField("questions", questions)
          }
        />

        <div className="exam-actions">

          <button
            className="btn btn-secondary"
            disabled={loading}
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>

          <button
            className="btn btn-success"
            disabled={loading}
            onClick={handlePublish}
          >
            {loading
              ? "Publishing..."
              : "Publish Exam"}
          </button>

        </div>

      </div>

    </div>
  );

};

export default CreateExam;
