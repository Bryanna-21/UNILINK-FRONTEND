import React, { useEffect, useState } from "react";
import NoteCard from "../../components/academic/NoteCard";
import "./Notes.css";


const Notes = () => {

  const [notes, setNotes] = useState([]);



  useEffect(() => {

    /*
      Temporary frontend data.
      Replace with API integration later.
    */

    const demoNotes = [

      {
        id: 1,
        title: "Introduction to Data Structures",
        unit: "CS201 - Data Structures and Algorithms",
        description:
          "Lecture notes covering arrays, linked lists, stacks and queues.",
        uploadedBy: "Dr. James Kariuki",
        date: "08 July 2026",
        views: 245
      },


      {
        id: 2,
        title: "Database Normalization Notes",
        unit: "CS202 - Database Management Systems",
        description:
          "Complete revision notes on database design and normalization.",
        uploadedBy: "Prof. Mary Wanjiku",
        date: "05 July 2026",
        views: 180
      },


      {
        id: 3,
        title: "Software Development Life Cycle",
        unit: "CS203 - Software Engineering",
        description:
          "Study guide explaining SDLC models and development processes.",
        uploadedBy: "Mr. Peter Otieno",
        date: "01 July 2026",
        views: 320
      }

    ];


    setNotes(demoNotes);


  }, []);



  const handleViewNote = (note) => {

    console.log(
      "Viewing note:",
      note
    );

    /*
      Later:

      navigate(
        `/student/notes/${note.id}`
      )

    */

  };



  const handleDownloadNote = (note) => {

    console.log(
      "Downloading:",
      note
    );

    /*
      Later:

      Connect to upload/download service
    */

  };



  return (

    <div className="notes-page">




      <main className="notes-content">


        <div className="notes-header">

          <h1>
            Study Notes
          </h1>


          <p>
            Access lecture materials uploaded by lecturers and students.
          </p>

        </div>




        <div className="notes-grid">


          {
            notes.length > 0 ?


            notes.map((note) => (

              <NoteCard

                key={note.id}

                note={note}

                onView={handleViewNote}

                onDownload={handleDownloadNote}

              />

            ))


            :


            <div className="empty-notes">

              No notes available.

            </div>

          }


        </div>



      </main>


    </div>

  );

};


export default Notes;
