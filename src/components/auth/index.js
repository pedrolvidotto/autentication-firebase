import { useEffect, useState } from 'react';
import './auth.css';
import {db} from '../../infra/firebaseConnection'
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import {doc, getDoc, setDoc} from 'firebase/firestore'

  function Auth() {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [user, setUser] = useState({})

  useEffect(() => {
    async function checkUser(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser({
            uid: user.uid,
            email: user.email
          })
        } else {
          setUser({})
        }
      });
    }

    checkUser()
  },[])

  async function handleSubmit(){
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, "user", user.uid),
         {
          nome: nome,
          telefone: telefone
        })
        .then(() =>{
          console.log('Dados cadastrados')
        })
        .catch((err) =>{
          console.log(err)
        })
      })
      .catch((error) => {
        if(error.code == 'auth/weak-password'){
          alert('Necessario mínimo de 6 caracteres para senha')
        }else if(error.code == 'auth/email-already-in-use'){
          alert('Email já cadastrado')
        }else{
          alert('Erro ao criar usuário')
          console.log(error)
        }
      });
  }

  async function logout(){
    const auth = getAuth();
    signOut(auth).then(() => {
        setEmail('')
        setNome('')
        setTelefone('')
        setPassword('')
        setLoginEmail('')

    }).catch((error) => {
      // An error happened.
    });
  }

  async function singIn(){
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      setUser(true)
      getDoc(doc(db, 'user', userCredential.user.uid))
      .then((snap) =>{
        setEmail(userCredential.user.email)
        setNome(snap.data().nome)
        setTelefone(snap.data().telefone)
      })
    })
    .catch((error) => {
      console.log(error)
    });
  }

  return (
    <div className="container">

      { Object.keys(user).length > 0 &&(
        <div>
          <strong>Seja bem Vindo! {user.email}</strong>
        </div>
      )}
      <h2>Login</h2>
      <label>Email: </label>
      <textarea type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}></textarea>
      <label>Senha: </label>
      <textarea type="text" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}></textarea>
      <br/>
      <button onClick={ handleSubmit }>Cadastrar</button>
      <button onClick={ singIn }>Logar</button>
      <br/>
      <button onClick={ logout }>Logout</button>

      <br/>
      <br/>

      <h2>Cadastro</h2>
      <label>Email: </label>
      <textarea type="text" value={email} onChange={(e) => setEmail(e.target.value)}></textarea>
      {Object.keys(user).length  > 0 && (
        <div  className="container">
          <label>Senha: </label>
          <textarea type="password" value={password} onChange={(e) => setPassword(e.target.value)}></textarea>
        </div>
      )}
      <label>Nome: </label>
      <textarea type="text" value={nome} onChange={(e) => setNome(e.target.value)}></textarea>
      <label>Telefone: </label>
      <textarea type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)}></textarea>
      <br/>
      <button onClick={ handleSubmit }>Cadastrar</button>
    </div>

    
  );
}

export default Auth;
