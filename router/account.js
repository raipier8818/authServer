const express = require('express');
const { findAccount, createAccount, deleteAccount, changePassword } = require('../modules/account');
const { createSession, findSession, deleteSession, updateSession } = require('../modules/auth');
const router = express.Router();


router.post('/register', (req, res) => {
  // TODO : 회원가입
  // 1. 이메일 or 전화번호 중복 체크
  const {email, id, password } = req.body;
  
  if (findAccount(id, password) != undefined){
    res.status(400).send('Account already exists');
    return;
  }

  // 2. 회원가입
  const account = createAccount(email, id, password);
  res.status(200).send('Account created. Verify your email or phone number.');
});

router.post('/login', (req, res) => {
  // TODO : 로그인
  // 1. 이메일 or 전화번호 체크
  // 2. 비밀번호 확인

  const { id, password } = req.body;
  const account = findAccount(id, password);
  if(account == undefined){
    res.status(400).send('Account not found');
    return;
  }
  // 3. 토큰 확인 및 발급
  if(req.cookies.token){
    const session = findSession(req.cookies.token);
    if(session){
      res.status(400).send('Already logged in.');
      return;
    }
  }
  const session = createSession(account.uuid);
  // res.clearCookie('token');
  res.cookie('token', session.token);
  // 4. 로그인 완료
  res.status(200).send('Login success');
});

router.post('/logout', (req, res) => {
  // TODO : 로그아웃
  // 1. 토큰 삭제
  const token = req.cookies.token;
  if(!token){
    res.status(400).send('Not logged in');
    return;
  }
  res.clearCookie('token');

  // 2. 세션 삭제
  deleteSession(token);

  // 3. 로그아웃 완료
  res.status(200).send('Logout success');
});

router.post('/refresh', (req, res) => {
  // TODO : 토큰 갱신
  // 1. 토큰 갱신
  const token = req.cookies.token;
  if(!token){
    res.status(400).send('Not logged in');
    return;
  }
  updateSession(token);

  // 2. 갱신 완료
  res.status(200).send('Refresh success');
});

router.post('/verify', (req, res) => {
  // TODO : 이메일 or 전화번호 인증
  // 1. 이메일 or 전화번호 인증
  // 2. 인증 완료
});

router.post('/withdraw', (req, res) => {
  // TODO : 회원 탈퇴
  // 1. 회원 탈퇴
  const {id, password} = req.body;
  const account = deleteAccount(id, password);
  if(account == undefined){
    res.status(400).send('Account not found');
    return;
  }
  // 2. 탈퇴 완료
  res.status(200).send('Withdraw success');
});

router.post('/change-password', (req, res) => {
  // TODO : 비밀번호 변경
  // 1. 비밀번호 변경
  const {id, password, newPassword} = req.body;
  const account = changePassword(id, password, newPassword);
  if(account == undefined){
    res.status(400).send('Account not found');
    return;
  }

  // 2. 변경 완료
  res.status(200).send('Change password success');
});


module.exports = router;