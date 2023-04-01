const sendBtn = document.getElementById('sendmsg');
const chatMsg = document.getElementById('chat-msg');
const chatBox = document.getElementById('chat-box');
const groupName = document.getElementById('create-group');
const addBtn = document.getElementById('add-group');
const chatGroup = document.getElementById('chat-user-group');
const token = localStorage.getItem('token');
const mobileInput = document.getElementById('invite-users-input');
const addUser = document.getElementById('adduser');
const logoutBtn = document.getElementById('logout');
const socket = io('http://localhost:3000')
let currentGroupId = null;
let currentUser;
let userli=[];

socket.on('connect', () => {
  console.log('User connected');
});

socket.on('disconnect', () => {
  console.log('User disconnected');
});

socket.on('newChat', (chat) => {
  if(chat.groupId=== currentGroupId){
    // console.log(chat)
    showchats(chat);
  }
  chatBox.scrollTop = chatBox.scrollHeight;
});

function chatRefresh(){
  try{
    socket.emit('joinRoom', currentGroupId);
  }catch(err){
    console.log(err)
  }
}

function sendChat(e){
    e.preventDefault()
    try{
      socket.emit('sendChat', {
        groupId: currentGroupId,
        userName: currentUser,
        message: chatMsg.value
      });
      chatMsg.value = ""
      
    }catch (err){
        console.log(err)
    }
    
}


logoutBtn.addEventListener('click', ()=>{
  window.location.href = '../Login/login.html';
  localStorage.removeItem('token');
})

async function loggedInUser(){
  try{
    const name =  await axios.get(`http://localhost:4000/user/name`, { headers: {"Authorization" : token }});
    // console.log(name)
    currentUser = name.data
  }catch{
    console.log(err)
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const groups = await axios.get(`http://localhost:4000/group/usergroup`, { headers: {"Authorization" : token }});
    // console.log(groups)
    groups.data.forEach(async(group) => {
      showGroup(group);
    });
    loggedInUser()

  } catch (err) {
    console.error(err);
  }
});

addBtn.addEventListener('click', addNewGroup);
sendBtn.addEventListener('click', sendChat)
let groupId;

chatGroup.addEventListener('click', async (event) => {
  
  groupId = event.target.getAttribute('data-group-id');
  if (groupId) {
    currentGroupId = groupId;
    chatBox.innerHTML = '';
    removeFromScreen()
    const User = await axios.get(`http://localhost:4000/group/getuser/${currentGroupId}`, { headers: {"Authorization" : token }});
    // console.log(User)
    User.data.forEach(async(user) => {
      const status = await isAdmin()
      if (status === 200){
        adminUser(user)
        addUser.style.display = 'block'
      }else{
        showUsers(user);
      }
      
    });
    chatRefresh()
    
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function removeFromScreen(){
  userli.forEach(li => {
      chatGroup.removeChild(li);
    });
    // clear the displayedExpenses array
    userli.length = 0;
}


async function addNewGroup(e){
    e.preventDefault()
    try{
      const newgroup = {
        name: groupName.value
    }

    const response = await axios.post(`http://localhost:4000/group/newgroup`, newgroup, {
       headers: {
        "Authorization" : token 
      }
      })
    // console.log(response)
    showGroup(newgroup)
    }catch(err){
      console.log(err)
    }
   
}


async function showGroup(group) {
  const linkTab = document.createElement('a');
  linkTab.className = 'btn btn-primary btn-lg btn-block';
  linkTab.setAttribute('data-group-id', group.id);
  const textNode = document.createTextNode(group.name);
  linkTab.appendChild(textNode);
  chatGroup.appendChild(linkTab);
}


function showchats(chat) {
  const li = document.createElement('li');
  // console.log(chat)
    li.className= 'list-group-item'
    // li.setAttribute('id', chat.id);
    const textNode= `${chat.userName}:${chat.message}`
    li.appendChild(document.createTextNode(textNode));
    chatBox.appendChild(li);
}



async function showUsers(user) {
    const li = document.createElement('li');
    li.className= 'list-group-item'
    li.setAttribute('id', user.id);
    const textNode= `${user.name}`
    li.appendChild(document.createTextNode(textNode));
    li.style.color = 'black'
    userli.push(li)
    chatGroup.appendChild(li);
}

 function adminUser(user){
  const li = document.createElement('li');
  li.className= 'list-group-item'
  li.setAttribute('id', user.id);
  const textNode= `${user.name}`
  li.appendChild(document.createTextNode(textNode));
  li.style.color = 'black'
  userli.push(li)
  chatGroup.appendChild(li);
  const removeButton = document.createElement('button');
  removeButton.className = 'btn btn-danger';
  removeButton.innerHTML = 'Remove';

  removeButton.addEventListener('click', async(e) => {
    try{
      var li= e.target.parentElement;
      const id = li.id;
      const response = await axios.delete(`http://localhost:4000/user/delete/${id}/${currentGroupId}`,{
        headers: {
           "Authorization" : token 
       }
      })
      // console.log(response)
      window.location.reload()
    }catch(err){
      console.log(err)
    }
  });
    li.appendChild(removeButton);
    chatGroup.appendChild(li);
}

addUser.addEventListener('click', async() => {
  try{
    const mobile= {
      mobile: mobileInput.value
    }
    const response = await axios.post(`http://localhost:4000/user/adduser/${currentGroupId}`, mobile,{
      headers: {
         "Authorization" : token 
     }
 })
 window.location.reload()
//  console.log(response)
showUsers(response.data)
  }catch(err){
    console.log(err)
  }
});

async function isAdmin(){
  try{
      const response = await axios.get(`http://localhost:4000/user/admin/${currentGroupId}`,{
        headers: {
           "Authorization" : token 
       }
      })
      // console.log(response)
      return response.status
  }catch(err){
    console.log(err)
  }
}



