
  let username=prompt('아이디를 입력하세요');
  let roomNum=prompt('채팅방 번호를 입력하세요');

  document.querySelector("#username").innerHTML=username;

  const eventSource=new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);

  eventSource.onmessage=(event)=>{
    const data=JSON.parse(event.data);
    if(data.sender==username){
      initMyMessage(data); //오른쪽 박스
    } else {
      initYourMessage(data); //왼쪽 박스
    }
  }
  
  function getSendMsgBox(msg,now) {
    return `<div class="sent_msg">
    <p>${msg}</p>
    <span class="time_date"> ${now}
  </div>`;
  }

  function getReceiveMsgBox(msg,now) {
    return `<div class="received_withd_msg">
    <p>${msg}</p>
    <span class="time_date"> ${now}
  </div>`;
  }

  function initMyMessage(data){
      
    let chatBox = document.querySelector('#chat-box'); //채팅 박스 
  
      let sendBox = document.createElement('div'); 
      sendBox.className = 'outgoing_msg'; 

      let date=new Date();
      let md = data.createdAt.substring(5,10)
      let tm = data.createdAt.substring(11,16)
      convertTime = tm + " | " + md
  
      sendBox.innerHTML = getSendMsgBox(data.msg,convertTime);
      chatBox.append(sendBox); 
      document.sender.scrollTop = document.sender.scrollHeight;
  }

  function initYourMessage(data){
    let chatBox = document.querySelector('#chat-box'); //채팅 박스 
  
      let receivedBox = document.createElement('div'); 
      receivedBox.className = 'received_msg'; 

      let date=new Date();
      let md = data.createdAt.substring(5,10)
      let tm = data.createdAt.substring(11,16)
      convertTime = tm + " | " + md
  
      receivedBox.innerHTML = getReceiveMsgBox(data.msg,convertTime);
      chatBox.append(receivedBox); 

      document.sender.scrollTop = document.sender.scrollHeight;
  }

  async function addMessage(){
     let msgInput = document.querySelector('#chat-outgoing-msg'); //입력창 
  
      let chat={
        sender:username,
        roomNum: roomNum,
        msg:msgInput.value, 
      };
      
      fetch("http://localhost:8080/chat",{
        method:"post",
        body:JSON.stringify(chat),
        headers: {
          "Content-Type":"application/json;charset=utf-8",
        },
      });

      msgInput.value = ''; //입력창 비워줌
  }

  
  document
    .querySelector("#chat-outgoing-button") 
    .addEventListener("click", () => {
        addMessage();
    });
  
  document
    .querySelector('#chat-outgoing-msg')
    .addEventListener('keydown', (e) => {
      if (e.keyCode == 13) {
        addMessage();
      }
    });
  
  