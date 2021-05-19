"use strict";

const id = document.querySelector("#id");
const name = document.querySelector("#name");
const confirmPw = document.querySelector("#confirm-pw");
const pw = document.querySelector("#pw");
const registerBtn = document.querySelector("#button");

registerBtn.addEventListener("click", register);

function register() {
    if( !id.value ) { return alert("아이디를 입력해주세요"); }
    if ( pw.value !== confirmPw.value ) { return alert("비밀번호가 일치하지 않습니다"); }

    const req = {
        name: name.value,
        id: id.value,
        pw: pw.value,
    };

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        //서버로부터 응답이오면 json호출->promise객체 반환 
        .then((res) => {
            if (res.success) {
                location.href = "/login";
            } else{
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error("회원가입 중 에러 발생");
        });

}