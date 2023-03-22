const sendBtn = document.getElementById('sendmsg');
const chatMsg = document.getElementById('chat-msg');
const chatBox = document.getElementById('chat-box');
const groupName = document.getElementById('create-group');
const addBtn = document.getElementById('add-group');
const chatGroup = document.getElementById('chat-user-group');
const token = localStorage.getItem('token')

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const users = await axios.get(`http://localhost:3000/chat/users`, {
      headers: {
        "Authorization": token
      }
    });
    const chats = await axios.get(`http://localhost:3000/chat/chats`, {
        headers: {
            "Authorization": token
        }
    });
    users.data.forEach((user) => {
      showUsers(user);
    });
    chats.data.forEach((chat)=>{
        showchats(chat);
    })
  } catch (err) {
    console.error(err);
  }
});

addBtn.addEventListener('click', addNewGroup);
sendBtn.addEventListener('click', sendChat)

function addNewGroup(e){
    e.preventDefault()
    const newgroup = {
        name: groupName.value
    }
    showUsers(newgroup)
}

async function sendChat(e){
    e.preventDefault()
    try{
        const newChat = {
            text: chatMsg.value
        }
        const response = await axios.post('http://localhost:3000/chat/chats', newChat,{
             headers: {
                "Authorization" : token 
            }
        });
        showchats(response.data)
    }catch (err){
        console.log(err)
    }
    
}

function showUsers(user) {
//   const li = document.createElement('li')
  const linkTab = document.createElement('a');
  linkTab.className = 'btn btn-primary btn-lg btn-block';
  linkTab.setAttribute('id', user.id);
  const textNode = document.createTextNode(user.name);
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



