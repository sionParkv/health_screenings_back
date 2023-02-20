const testtest = (req, res) => {
  res.json({ code: 'OK', message: '명지병원 태블릿 백엔드 연결 테스트' })
}
const testController = {
  testtest,
}
export { testController }
