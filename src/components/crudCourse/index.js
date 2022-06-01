import { useEffect, useState } from 'react';
import './crudCourse.css';
import {db} from '../../infra/firebaseConnection'
import {collection, addDoc, doc, getDocs, getDoc, onSnapshot, updateDoc, deleteDoc} from 'firebase/firestore'

function CrudCourse() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [id, setId] = useState('')
  const [course, setCourse] = useState([])


  useEffect(() => {
    async function loadCourse(){
        const colRef = await collection(db, "course")
        await onSnapshot(colRef, (snapshot) => {
          let list = []
          snapshot.docs.forEach((doc) => {
              list.push({ 
                      titulo: doc.data().titulo,
                      autor: doc.data().autor,
                      id: doc.id})
            })
            setCourse(list)
        })
    }
    loadCourse()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'course'), {
        titulo: titulo,
        autor: autor
      })
      .then(() =>{
        console.log('Dados cadastrados')
      })
      .catch((err) =>{
        console.log(err)
      })
    } catch (err) {
      alert(err)
    }
  }

  const findOne = async (id) => {
    const snap = await getDoc(doc(db, 'course', id))
    if (snap.exists()) {
      setTitulo(snap.data().titulo)
      setAutor(snap.data().autor)
      setId(id)
    }
    else {
      console.log("No such document")
    }
  }

  async function findAll(){
    const response = await collection(db,'course');
    await getDocs(response).then(resp=>{
      const courses = resp.docs.map(doc => ({
          titulo: doc.data().titulo,
          autor: doc.data().autor,
          id: doc.id
      }))
      setCourse(courses)
    })
    .catch(() => {
      console.log('Deu erro')
    })
  }

  function edit(obj){
    findOne(obj.id)
  }

  async function updateCourse(){
    let obj = {titulo: titulo, autor: autor}
    const docRef = doc(db, 'course', id)
    await updateDoc(docRef,obj)
      .then(resp => {
        console.log(resp)
      })
      .catch(error => console.log(error))
  }

  async function deleteCourse(obj){
    await deleteDoc(doc(db, "course", obj.id));
  }

  return (
    <div className="container">
     
     <label>Titulo: </label>
     <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}></textarea>

     <label>Autor: </label>
     <textarea type="text" value={autor} onChange={(e) => setAutor(e.target.value)}></textarea>

     <button onClick={ handleSubmit }>Cadastrar</button>
     <button onClick={ updateCourse }>Editar</button>

     <br/>

    <ul>
      {course.map((c) => {
        return( 
        <li key={c.id}>
          <span>Titulo: {c.titulo} </span><br/>
          <span>Autor: {c.autor} </span><br/>
          <button onClick={() => edit(c)} >Editar</button>
          <button onClick={() => deleteCourse(c)} >Delete</button>
        </li>
        )
      })}
    </ul>
    </div>
  );
}

export default CrudCourse;
