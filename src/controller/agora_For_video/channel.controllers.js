

const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const APP_ID = 'f6568a063d6643289d64e0346940341e';
const APP_CERTIFICATE = 'a3861d180f0a416b95fe563d7ea991ca';


module.exports.join_channel_for_legalcare = (req, resp) => {

  // set response header
  resp.header('Access-Control-Allow-Origin', '*');
  const generatedchannelName = uuidv4();
  // get uid
  let uid = req.params.uid;
  if (!uid || uid === '') {
    return resp.status(400).json({ 'error': 'uid is required' });
  }

  // get role
  let role;
  if (req.params.role === 'publisher') {
    role = RtcRole.PUBLISHER;
  } else if (req.params.role === 'subscriber') {
    role = RtcRole.SUBSCRIBER
  } else {
    return resp.status(400).json({ 'error': 'role is incorrect' });
  }


  // get the expire time
  let expireTime = req.query.expiry;
  if (!expireTime || expireTime === '') {
    expireTime = 60 * 60;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  console.log(role);

  // build the token
  let token;
  // token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, role, privilegeExpireTime);

  if (req.params.tokentype === 'userAccount') {
    token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, generatedchannelName, uid, role, privilegeExpireTime);
  } else if (req.params.tokentype === 'uid') {
    token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, generatedchannelName, uid, role, privilegeExpireTime);
  } else {
    return resp.status(400).json({ 'error': 'token type is invalid' });
  }

  // return the token
  return resp.json({
    'rtcToken': token,
    'generatedchannelName': generatedchannelName
  });
}


