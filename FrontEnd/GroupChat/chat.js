const sendBtn = document.getElementById('sendmsg');
const chatMsg = document.getElementById('chat-msg');
const chatBox = document.getElementById('chat-box');
const groupName = document.getElementById('create-group');
const addBtn = document.getElementById('add-group');
const chatGroup = document.getElementById('chat-user-group');
const token = localStorage.getItem('token');

let currentGroupId = null;


window.addEventListener("DOMContentLoaded", async () => {
  try {
    const groups = await axios.get(`http://localhost:3000/group/usergroup`, { headers: {"Authorization" : token }});
    // console.log(groups)
    groups.data.forEach((group) => {
      showGroup(group);
    });
    // chatRefresh()

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
    const chats = await axios.get(`http://localhost:3000/chat/chats/${groupId}`, { headers: {"Authorization" : token }});
    console.log(chats)
    chats.data.forEach((chat) => {
      showchats(chat);
    });
    chatRefresh()
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

async function chatRefresh(){
  try{
    setInterval(async ()=>{
      if (currentGroupId) {
        const chats = await axios.get(`http://localhost:3000/chat/newchats/${currentGroupId}`, { headers: {"Authorization" : token }});
        chats.data.forEach((chat) => {
          showchats(chat);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    },5000)
  }catch(err){
    console.log(err)
  }
}

async function addNewGroup(e){
    e.preventDefault()
    try{
      const newgroup = {
        name: groupName.value
    }

    const response = await axios.post(`http://localhost:3000/group/newgroup`, newgroup, {
       headers: {
        "Authorization" : token 
      }
      })
    console.log(response)
    showUsers(newgroup)
    }catch(err){
      console.log(err)
    }
   
}

async function sendChat(e){
    e.preventDefault()
    try{
        const newChat = {
            message: chatMsg.value
        }
        const response = await axios.post(`http://localhost:3000/chat/chats/${currentGroupId}`, newChat,{
             headers: {
                "Authorization" : token 
            }
        });
        // console.log(groupId)
        // console.log(response)
        showchats(response.data )
        // chatRefresh();
        chatMsg.value ='';
        chatBox.scrollTop = chatBox.scrollHeight;
    }catch (err){
        console.log(err)
    }
    
}

function showGroup(group) {
//   const li = document.createElement('li')
  const linkTab = document.createElement('a');
  linkTab.className = 'btn btn-primary btn-lg btn-block';
  linkTab.setAttribute('data-group-id', group.id);
  const textNode = document.createTextNode(group.name);
  linkTab.appendChild(textNode);
//   li.appendChild(linkTab)
  chatGroup.appendChild(linkTab);
}

function showchats(chat) {
  console.log(chat)
    const li = document.createElement('li');
    li.className= 'list-group-item'
    // li.setAttribute('id', chat.id);
    const textNode= `${chat.user.name}:${chat.message}`
    li.appendChild(document.createTextNode(textNode));
    chatBox.appendChild(li);
}



