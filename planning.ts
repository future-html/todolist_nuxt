// 1. todolist
// 2. authentication, board, invitation
// 3. create and planning data first
// data  = user, boardInfo
// - user info [{username, password, email}], prevent by middleware use global variable
// post to database and get the data when sign in
// 3.1 isAuthenticated  = false, signin sucess ==> isAuthenticated = true
// - board info [{boardId, taskId, taskName, taskDescription, taskDueDate, assigneeName, assigneeId, status, priority}]
// - assignee info (including in boardinfo)
// 4. connect to database postgressql and testing by API

// {"users":[{"userId":"user-1","name":"","email":"isiisisiis@eoxo.com","password":""},{"userId":"user-2","name":"","email":"aooaoappap@exomple.com","password":""},{"userId":"user-3","name":"dkkdkkd","email":"pdppdpdp@eooe.com","password":"pdpdppd"},{"userId":"user-4","name":"asppospps","email":"s33s3s@xl.com","password":"pdpdppd"}],"boards":[{"boardId":"board-4","boardName":"skisiisfutureaps[a[a","people":[],"owner":"user-4"},{"boardId":"board-5","boardName":"future","people":[],"owner":"user-3"},{"boardId":"board-6","boardName":"ssppspps","people":[],"owner":"user-4"},{"boardId":"board-7","boardName":"spspppsps","people":[],"owner":"user-4"},{"boardId":"board-1743496676419","boardName":"ss[s[s[","people":[],"owner":"user-4"},{"boardId":"board-1743496986313","boardName":"pspspps","people":[],"owner":"user-4"}],"columns":[],"tasks":[]}
