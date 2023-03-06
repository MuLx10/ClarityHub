import { CometChat } from '@cometchat-pro/chat'
import { setGlobalState } from '../store'
import { cometConfig } from './config/comet-config'

const initCometChat = async () => {
  const appID = cometConfig.COMET_APP_ID
  const region = cometConfig.COMET_APP_REGION

  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build()

  await CometChat.init(appID, appSetting)
    .then(() => console.log('Initialization completed successfully'))
    .catch((error) => error)
}

const authKey = cometConfig.COMET_AUTH_KEY

const loginWithCometChat = async (UID) => {
  await CometChat.login(UID, authKey)
    .then((user) => setGlobalState('currentUser', user))
    .catch((error) => {
      alert(error.message)
      console.log(error)
    })
  return true
}

const signUpWithCometChat = async (UID, name) => {
  const user = new CometChat.User(UID)
  user.setName(name)

  await CometChat.createUser(user, authKey)
    .then((user) => {
      alert('Signed up successfully, click login now!')
      console.log('Logged In: ', user)
    })
    .catch((error) => {
      alert(error.message)
      console.log(error)
    })
  return true
}

const logOutWithCometChat = async () => {
  return await CometChat.logout()
    .then(() => console.log('Logged Out Successfully'))
    .catch((error) => error)
}

const isUserLoggedIn = async () => {
  await CometChat.getLoggedinUser()
    .then((user) => setGlobalState('currentUser', user))
    .catch((error) => console.log('error:', error))
}

const getMessages = async (UID) => {
  const limit = 30
  const messagesRequest = new CometChat.MessagesRequestBuilder()
    .setUID(UID)
    .setLimit(limit)
    .build()

  return await messagesRequest
    .fetchPrevious()
    .then((messages) => messages)
    .catch((error) => error)
}

const sendMessage = async (receiverID, messageText) => {
  const receiverType = CometChat.RECEIVER_TYPE.USER
  const textMessage = new CometChat.TextMessage(
    receiverID,
    messageText,
    receiverType
  )

  return await CometChat.sendMessage(textMessage)
    .then((message) => message)
    .catch((error) => error)
}

const getConversations = async () => {
  const limit = 30
  const conversationsRequest = new CometChat.ConversationsRequestBuilder()
    .setLimit(limit)
    .build()

  return await conversationsRequest
    .fetchNext()
    .then((conversationList) => conversationList)
}

export {
  initCometChat,
  loginWithCometChat,
  signUpWithCometChat,
  logOutWithCometChat,
  getMessages,
  sendMessage,
  getConversations,
  isUserLoggedIn,
  CometChat,
}