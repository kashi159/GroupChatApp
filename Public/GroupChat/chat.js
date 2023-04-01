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
const picBtn = document.getElementById('multimedia');
const socket = io('http://44.235.123.187:4000')
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


picBtn.addEventListener('click', function() {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);
  socket.emit('sendChat', {
    groupId: currentGroupId,
    userName: currentUser,
    file: formData
  });
  chatMsg.value = '';
  fileInput.value = '';
});


async function sendChat(e){
    e.preventDefault()
    try{
      socket.emit('sendChat', {
        groupId: currentGroupId,
        userName: currentUser,
        message: chatMsg.value
      });
      const newChat = {
        message: chatMsg.value
    }
    const response = await axios.post(`http://44.235.123.187/chat/chats/${currentGroupId}`, newChat,{
         headers: {
            "Authorization" : token 
        }
    });
    // showDbChats(response.data )
      chatMsg.value = ""
      
    }catch (err){
        console.log(err)
    }
    
}

function showDbChats(chat) {
  const li = document.createElement('li');
  // console.log(chat)
    li.className= 'list-group-item'
    // li.setAttribute('id', chat.id);
    const textNode= `${chat.user.name}:${chat.message}`
    li.appendChild(document.createTextNode(textNode));
    chatBox.appendChild(li);
}

logoutBtn.addEventListener('click', ()=>{
  window.location.href = '../Login/login.html';
  localStorage.removeItem('token');
})

async function loggedInUser(){
  try{
    const name =  await axios.get(`http://44.235.123.187/user/name`, { headers: {"Authorization" : token }});
    // console.log(name)
    currentUser = name.data
  }catch{
    console.log(err)
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const groups = await axios.get(`http://44.235.123.187/group/usergroup`, { headers: {"Authorization" : token }});
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
    removeFromScreen();

    const chats = await axios.get(`http://44.235.123.187/chat/chats/${groupId}`, { headers: {"Authorization" : token }});
    // console.log(chats)
    chats.data.forEach((chat) => {
      showDbChats(chat);
    });

    const User = await axios.get(`http://44.235.123.187/group/getuser/${currentGroupId}`, { headers: {"Authorization" : token }});
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

    const response = await axios.post(`http://44.235.123.187/group/newgroup`, newgroup, {
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

  if (chat.file) {
    const fileLink = document.createElement('a');
    fileLink.href = URL.createObjectURL(chat.file.fileBuffer);
    fileLink.textContent = chat.file.fileName;
    chatBox.appendChild(fileLink);
  }
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
      const response = await axios.delete(`http://44.235.123.187/user/delete/${id}/${currentGroupId}`,{
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
    const response = await axios.post(`http://44.235.123.187/user/adduser/${currentGroupId}`, mobile,{
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
      const response = await axios.get(`http://44.235.123.187/user/admin/${currentGroupId}`,{
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



