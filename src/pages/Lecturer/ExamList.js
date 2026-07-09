  return (
    <div className="exam-list-page">

      <div className="page-header">

        <div>
          <h1>My Exams</h1>
          <p>Manage all your examinations.</p>
        </div>

      </div>

      <div className="exam-statistics">

        <div className="stat-card">
          <h2>{statistics.total}</h2>
          <span>Total Exams</span>
        </div>

        <div className="stat-card">
          <h2>{statistics.drafts}</h2>
          <span>Drafts</span>
        </div>

        <div className="stat-card">
          <h2>{statistics.published}</h2>
          <span>Published</span>
        </div>

        <div className="stat-card">
          <h2>{statistics.closed}</h2>
          <span>Closed</span>
        </div>

      </div>

      <div className="exam-toolbar">

        <input
          type="text"
          className="form-control"
          placeholder="Search exams..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="form-control"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Closed">Closed</option>
        </select>

      </div>

      {loading ? (

        <div className="loading-state">
          Loading exams...
        </div>

      ) : filteredExams.length === 0 ? (

        <div className="empty-state">

          <h3>No Exams Found</h3>

          <p>
            Create your first exam to get started.
          </p>

        </div>

      ) : (

        <div className="exam-grid">

          {filteredExams.map((exam) => (

            <ExamCard
              key={exam._id}
              exam={exam}
              role="lecturer"
              onDelete={handleDelete}
              onPublish={handlePublish}
              onClose={handleClose}
              onDuplicate={handleDuplicate}
            />

          ))}

        </div>

      )}

    </div>
  );

};

export default ExamList;
