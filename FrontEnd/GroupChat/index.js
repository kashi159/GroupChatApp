const sendBtn = document.getElementById('sendmsg');
const chatMsg = document.getElementById('chat-msg');
const chatBox = document.getElementById('chat-box');
const groupName = document.getElementById('create-group');
const addBtn = document.getElementById('add-group');
const chatGroup = document.getElementById('chat-group');
const token = localStorage.getItem('token')

// window.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const groups = await axios.get(`http://localhost:4000/chat/group`, {
//       headers: {
//         "Authorization": token
//       }
//     });
//     groups.data.forEach((group) => {
//       showGroup(group);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// });

addBtn.addEventListener('click', addNewGroup);
sendBtn.addEventListener('click', sendChat)

function addNewGroup(e){
    e.preventDefault()
    const newgroup = {
        name: groupName.value
    }
    showGroup(newgroup)
}

function sendChat(e){
    e.preventDefault()
    const newChat = {
        text: chatMsg.value
    }
    showchats(newChat)
}

function showGroup(group) {
//   const li = document.createElement('li')
  const linkTab = document.createElement('a');
  linkTab.className = 'btn btn-primary btn-lg btn-block';
  linkTab.setAttribute('id', group.id);
  const textNode = document.createTextNode(group.name);
  linkTab.appendChild(textNode);
//   li.appendChild(linkTab)
  chatGroup.appendChild(linkTab);
}

function showchats(chat) {
    const li = document.createElement('li');
    li.className= 'list-group-item'
    // li.setAttribute('id', chat.id);
    const textNode= `${chat.text}`
    li.appendChild(document.createTextNode(textNode));
    chatBox.appendChild(li);
}



