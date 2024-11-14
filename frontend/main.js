
const server = 'http://localhost:3000'
async function serverAddStudent(obj){
  let response = await fetch(server + '/api/students', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })
  let data = await response.json()

  return data
}

async function serverGetStudent(){
  let response = await fetch(server + '/api/students', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  })
  let data = await response.json()

  return data
}
await serverGetStudent();


async function serverDeleteStudent(id){
  let response = await fetch(server + '/api/students/'+ id, {
    method: "DELETE",
  })
  let data = await response.json()

  return data
}
await serverGetStudent();
let serverData = await serverGetStudent()
let studentsList = []
if(serverData){
  studentsList = serverData
}
//let studentsList = [{
  //name:'Руслан',
  //lastname: "Кашапов",
  //surname: "Азатович",
  //birthday: new Date(2001, 6, 22),
  //faculty: "Информатика",
  //studyStart: '2019',
//},
//{
  //name:'Никита',
  //lastname: "Русаков",
  //surname: "Станиславович",
  //birthday: new Date(2001, 3, 13),
  //faculty: "Математика",
  //studyStart: '2019',
//},
//{
  //name:'Алексей',
  //lastname: "Зеленов",
  //surname: "Владимирович",
  //birthday: new Date(2002, 4, 26),
  //faculty: "Русский язык",
  //studyStart: '2017',},{
  //name:'Булат',
  //lastname: "Хуснуриялов",
  //surname: "Алексеевич",
  //birthday: new Date(2003, 6, 24),
  //faculty: "Информатика",
  //studyStart: '2021',
  //
//},
//{
  //name:'Арслан',
  //lastname: "Ахтямов",
  //surname: "Альбертович",
  //birthday: new Date(1999, 3, 14),
  //faculty: "Робототехника",
  //studyStart: '2017',}]

function formatDate(date){
  var dd = date.getDate();
  if (dd < 10) dd='0' + dd;
  var mm = date.getMonth() + 1;
  if (mm < 10) mm= '0' + mm;
  var yy = date.getFullYear();
  if (yy < 10) yy= '0' + yy;
  return dd + '.' + mm + '.' + yy;
}

function getStudentItem(studentObj) {
  const newTr = document.createElement("tr")
  const newTdFIO = document.createElement("td")
  const newTdbirthday = document.createElement("td")
  const newTdfaculty = document.createElement("td")
  const newTdstudyStart = document.createElement("td")
  const newTdDelete = document.createElement("td")
  const newBtn = document.createElement("button")
  newBtn.classList.add("btn", "btn-danger")
  newBtn.textContent = "Удалить студента"


  newTdFIO.textContent = `${studentObj.lastname} ${studentObj.name} ${studentObj.surname}`
  newTdbirthday.textContent = formatDate(new Date(studentObj.birthday))
  newTdfaculty.textContent = studentObj.faculty
  newTdstudyStart.textContent = titleLearn(studentObj.studyStart);
  newBtn.addEventListener("click", async function(){
    await serverDeleteStudent(studentObj.id)
    newTr.remove()
  })

  newTdDelete.append(newBtn)
  function titleLearn(studyStart) {
    let now = new Date();
    let yearEnd = parseInt(studyStart) + 4;
    if ((now.getMonth() + 1 > 8 && yearEnd === now. getFullYear()) || yearEnd < now.getFullYear()){
      return (`${studyStart}-${yearEnd}(закончил)`);
    }
    else {
      return (`${studyStart}-${yearEnd}(${now.getFullYear() - studyStart} курс)`);
    }}
  newTr.append(newTdFIO, newTdbirthday, newTdfaculty, newTdstudyStart, newTdDelete)
  return newTr
}


let sortColumnFlag = 'fio',
    sortDirFlag = true
const newThFIO = document.getElementById("sort__fio");
const newThAge = document.getElementById("sort__age");
const newThfacultyy = document.getElementById("sort__facultyy");
const newThDatapost = document.getElementById("sort__datapost");
const filterForm = document.getElementById("filter__form");
const filterFIO = document.getElementById("filter__fio");
const filterbirthday = document.getElementById("filter__birthday");
const filterfaculty = document.getElementById("filter__faculty");
const filterstudyStart = document.getElementById("filter__studyStart");



function renderStudentsTable(studentsArray) {
  let copyArr = studentsArray.map((user) => ({
    ...user,
    fio: `${user.lastname} ${user.name} ${user.surname}`,

  }));
  const $studentTable = document.getElementById("student-table")

 copyArr = copyArr.sort(function(a, b){
    let sort = a[sortColumnFlag] < b[sortColumnFlag]
    if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag]
    if (sort) return -1
  })


  if (filterFIO.value.trim() !== ""){
    copyArr = copyArr.filter(function(user){
      if (user.fio. includes(filterFIO.value.trim())) return true
    });
  }
  if (filterbirthday.value.trim() !== ""){
    copyArr = copyArr.filter(function(user){
      if (user.studyStart. includes(filterbirthday.value.trim())) return true
    });
  }
  if (filterstudyStart.value.trim() !== ""){
    copyArr = copyArr.filter(function(user){
      if (`${+user.studyStart + 4}`. includes(filterstudyStart.value.trim())) return true
    });
  }
  if (filterfaculty.value.trim() !== ""){
    copyArr = copyArr.filter(function(user){
      if (user.faculty. includes(filterfaculty.value.trim())) return true
    });
  }

  $studentTable. innerHTML = ''
  for (const studentObj of copyArr){
    const newTr1 = getStudentItem(studentObj)
    $studentTable.append(newTr1)
  }
}
renderStudentsTable(studentsList)

document.getElementById("add-form").addEventListener("submit", async function(event){
  event.preventDefault()
  let newStudentObj = {
    name: document.getElementById("name-input").value,
    lastname: document.getElementById("lastname-input").value,
    surname: document.getElementById("surname-input").value,
    birthday: new Date(document.getElementById("birthday-input").value),
    faculty: document.getElementById("faculty-input").value,
    studyStart: document.getElementById("studyStart-input").value,
  }
  let serverDataObj = await serverAddStudent(newStudentObj);
  serverDataObj.birthday = new Date(serverDataObj.birthday);
  var currentYear = new Date().getFullYear();


  if (newStudentObj.name.trim() == ""){
    alert('Имя не введено')
    return
  }
  if (newStudentObj.lastname.trim() == ""){
    alert('Фамилия не введена')
    return
  }
  if (newStudentObj.surname.trim() == ""){
    alert('Отчество не введено')
    return
  }

  if (newStudentObj.faculty.trim() == ""){
    alert('Факультет не введен')
    return
  }
  if (newStudentObj.studyStart.trim() == ""){
    alert('Дата поступления не введена')
    return
  }
  function isValidDate(birthday){
    const minDate = new Date(1900, 0, 1);
    const maxDate = new Date();
    return birthday >= minDate && birthday <= maxDate;
  }
  if (!isValidDate(newStudentObj.birthday)) {
    alert("Дата рождения введена некорректно");
    return;
 }

  if (newStudentObj.studyStart.trim() < 2000 ||  newStudentObj.studyStart.trim() > currentYear) {
    alert('Дата поступления должна быть от 2000 до текущего года')
    return
  }
 studentsList.push(serverDataObj)
  renderStudentsTable(studentsList)
})

newThFIO.addEventListener('click', function(){
  sortColumnFlag = 'fio'
  sortDirFlag = !sortDirFlag
  renderStudentsTable(studentsList)
})
newThfacultyy.addEventListener('click', function(){
  sortColumnFlag = 'faculty'
  sortDirFlag = !sortDirFlag
  renderStudentsTable(studentsList)
})
newThAge.addEventListener('click', function(){
  sortColumnFlag = 'birthday'
  sortDirFlag = !sortDirFlag
  renderStudentsTable(studentsList)
})

newThDatapost.addEventListener('click', function(){
  sortColumnFlag = 'studyStart'
  sortDirFlag = !sortDirFlag
  renderStudentsTable(studentsList)
})

if (filterFIO.value.trim() !== ""){
  copyArr = copyArr.filter(function(user){
    if (user.fio.includes(filterFIO.value.trim())) return true
  });
}

if (filterbirthday.value.trim() !== ""){
  copyArr = copyArr.filter(function(user){
    if (user.birthday.includes(filterbirthday.value.trim())) return true
  });
}

if (filterfaculty.value.trim() !== ""){
  copyArr = copyArr.filter(function(user){
    if (user.faculty.includes(filterfaculty.value.trim())) return true
  });
}
if (filterstudyStart.value.trim() !== ""){
  copyArr = copyArr.filter(function(user){
    if (user.studyStart.includes(filterstudyStart.value.trim())) return true
  });
}



filterForm.addEventListener('submit', function(event){
  event.preventDefault()
})

filterFIO.addEventListener('input', function(){
  renderStudentsTable(studentsList)
})
filterbirthday.addEventListener('input', function(){
  renderStudentsTable(studentsList)
})

filterfaculty.addEventListener('input', function(){
  renderStudentsTable(studentsList)
})

filterstudyStart.addEventListener('input', function(){
  renderStudentsTable(studentsList)
})


