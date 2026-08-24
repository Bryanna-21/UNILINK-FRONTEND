import React, { useEffect, useState } from "react";
import NoteCard from "../../components/academic/NoteCard";
import "./Notes.css";


const Notes = () => {

  const [notes, setNotes] = useState([]);



  useEffect(() => { let active=true; import("../../services/noteService").then(({default:service})=>service.getNotes()).then(raw=>{if(active)setNotes(Array.isArray(raw)?raw:[])}).catch(()=>{if(active)setNotes([])}); return ()=>{active=false}; }, []);



  const handleViewNote = (note) => {

    window.location.href = `/student/notes/${note.id}`;

  };



  const handleDownloadNote = (note) => {

    import("../../services/noteService").then(({default:service})=>service.downloadNote(note.id)).then(({data})=>{const url=URL.createObjectURL(data);const a=document.createElement("a");a.href=url;a.download=`${note.title||"note"}.pdf`;a.click();URL.revokeObjectURL(url);}).catch(()=>{});

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
