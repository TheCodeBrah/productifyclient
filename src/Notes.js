import React, { useEffect, useState } from "react";
import "./styles/Notes.css";
import reactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import axios from "axios";
import trashimg from "./images/trash.jpg";
function Notes() {
  const [noteCreator, setNoteCreator] = useState(false);
  const [note, setNote] = useState();
  const [editing, setEditing] = useState({ state: false, id: undefined });
  const [noteList, setNoteList] = useState([]);
  const [id, setId] = useState(0);
  const [title, setTitle] = useState(false);
  const [titleContent, setTitleContent] = useState();
  const [toolbar, setToolbar] = useState({ state: false, id: undefined });
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
      
      'Access-Control-Allow-Origin': "http://localhost:3000/",
      'Access-Control-Allow-Credentials': true
    },
    
  });

  //Database Control
  function deleteNote(data) {
    api.post("/removenote", data).catch((err) => {
      console.log(err);
    });
    const filteredList = noteList.filter((note) => note.id !== data.id);
    setNoteList(filteredList);
  }
  function addNote(data) {
    api.post("/newnote", data).catch((err) => {
      console.log(err);
    });
  }
  function replaceNote(data) {
    api.post("/replacenote", data).catch((err) => {
      console.log(err);
    });
  }
  function getNotes() {
    api.get("/notelist").then((res) => {
      setNoteList((nl) => (nl = res.data));
      if (res.data.length !== 0) {
        const maxId = res.data.reduce((a, b) => (a.id > b.id ? a : b)).id;
        console.log(res.data);
        setId(maxId + 1);
      }
    });
  }
  //loadPage
  useEffect(() => {
    getNotes();
  }, []);
  //Quill Modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
    ],
  };
  const titleModule = {
    toolbar: [
      [{ header: [1] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
    ],
  };
  // start NoteCreator
  function createNote() {
    setNoteCreator(true);
    setTitle(false);
    console.log(title);
  }
  //Finalize Note
  function finalizeNote() {
    setNoteCreator(false);

    if (!editing.state) {
      setNoteList([
        ...noteList,
        { content: note, id: id, title: titleContent },
      ]);
      addNote({ content: note, id: id, title: titleContent });
      setId(id + 1);
      setTitle(false);
      }  else {
        const filteredList = noteList.filter((note) => note.id !== editing.id);
        console.log(filteredList);
        console.log(note);
        setTitle(false);
        setNoteList([
          ...filteredList,
          { content: note, id: editing.id, title: editing.title },
        ]);
        replaceNote({ content: note, id: editing.id, title: editing.title });
        setEditing({ state: false, id: undefined, title: undefined });
      
    }
  
  
    setNote("");
    setTitleContent(undefined);
  }
  //noteList
  const showNotes = noteList.map((n) => {
    return (
      <div
        className="note"
        key={n.id}
        onMouseEnter={() => {
          setToolbar({ state: true, id: n.id });
        }}
        onMouseLeave={() => {
          setToolbar({ state: false, id: undefined });
        }}
      >
        <div
          className={
            toolbar.state && toolbar.id === n.id
              ? "toolbar-wrapper"
              : "hide-toolbar"
          }
        >
          <img
            src={trashimg}
            className="delete-note"
            alt="deleteNote"
            onClick={() => {
              deleteNote({ id: n.id });
            }}
          ></img>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: n.title }}
          className="note-title"
          onClick={() => {
            setTitle(true);
            setNoteCreator(true);
            const curNote = n.note;
            setNote(n.content);
            setEditing({ state: true, id: n.id, title: n.title });
            console.log("editing");
          }}
        ></div>
      </div>
    );
  });

  //return Content

  return (
    <div className="notes">
      <h1>Notes</h1>

      {/* showNotes */}

      {!noteCreator && (
        <>
          <div className="notes-wrapper">{showNotes}</div>
          <button className="new-note-btn" onClick={createNote}>
            Create New Note
          </button>
        </>
      )}
      {/* noteCreator */}

      {noteCreator && (
        <>
          {/* title */}
          <span className={!title ? undefined : "disabled"}>
            <div className="title-writer">
              <ReactQuill
                theme="snow"
                value={titleContent}
                onChange={setTitleContent}
                className="title-setter"
                modules={titleModule}
              ></ReactQuill>
            </div>
            <button
              onClick={() => {
                setTitle(true);
              }}
              className="new-note-btn"
            >
              Confirm Title
            </button>
          </span>
          {/* bodyEditor */}
          <span className={title ? undefined : "disabled"}>
            <div className="note-creator">
              <ReactQuill
                theme="snow"
                value={note}
                onChange={setNote}
                className="text-editor"
                modules={modules}
              ></ReactQuill>
            </div>

            <button onClick={finalizeNote} className="new-note-btn">
              Save Note
            </button>
            <button
              onClick={() => {
                setNoteCreator(false);
                setTitleContent(undefined);
                setNote("");
              }}
            >
              Cancel
            </button>
          </span>
        </>
      )}
    </div>
  );
}

export default Notes;
