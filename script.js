//select elemnts 
let countSpan=document.querySelector(".count span");
let bullets =document.querySelector(".bullets");
let bulletspanContainer=document.querySelector(".bullets .spans");
let quizarea=document.querySelector(".quiz-area");
let quizinfo=document.querySelector(".quiz-info");
let currentindex=0;
let rightanswers=0;
let countdowninterval;
let answersarea=document.querySelector(".answers-area");
let submitbutton=document.querySelector(".submit");
let results=document.querySelector(".results");
let countdownelement=document.querySelector(".countdown");
let filename;

function getQuestions(filename){
currentindex = 0;
rightanswers = 0;
bulletspanContainer.innerHTML = "";
quizarea.innerHTML = "";
answersarea.innerHTML = "";
results.innerHTML = "";
let myrequset=new XMLHttpRequest();
myrequset.onreadystatechange=function(){
    if(this.readyState===4 && this.status===200){
       let questionsobj=JSON.parse(this.responseText)  ;
        let questioncount=questionsobj.length;
        createBullets(questioncount);
    //Add question data
        addQuestionData(questionsobj[currentindex],questioncount);
       
       countdown(180,questioncount);

            submitbutton.onclick=()=>{
            let rightanswer=questionsobj[currentindex].answer;
            currentindex++;
            checkAnswer(rightanswer,questioncount);
            //add next question
            if(currentindex<questioncount){
            quizarea.innerHTML="";
            answersarea.innerHTML="";
            addQuestionData(questionsobj[currentindex],questioncount);
            //handle active bullet
            handleBullets();
            }
            else{
                clearInterval(countdowninterval);
                showResults(questioncount);
            }
            }

    }
 }
myrequset.open("GET",filename,true);
myrequset.send();
}


function createBullets(num){
    countSpan.innerHTML=num;
    //create spans
    for(let i=0;i<num;i++){
        let thebullet=document.createElement("span");
        if (i===0){
         thebullet.className="on";
        }
        bulletspanContainer.appendChild(thebullet);
    }
}

////////////////////////////////////////////////////////////////////////////////////////

function addQuestionData(obj,count){
if(currentindex<count){
//create q title
let QuestionTitle=document.createElement("h2");
let Qtext=document.createTextNode(obj.question);
QuestionTitle.appendChild(Qtext);
quizarea.appendChild(QuestionTitle);

obj.options.forEach((option,i) => {
    let maindiv=document.createElement("div");
    maindiv.className="answer";

    let radioinput=document.createElement("input");
    radioinput.type="radio";
    radioinput.name="question"
    radioinput.id=`answer${i+1}`;
    radioinput.dataset.answer=option;
    if(i===0){
        radioinput.checked=true;
    }

    let label=document.createElement("label");
    label.htmlFor=`answer${i+1}`;
    let labeltext=document.createTextNode(option);
    label.appendChild(labeltext);
    maindiv.appendChild(radioinput);
    maindiv.appendChild(label);
    answersarea.appendChild(maindiv);  
});
}
}

//Check Answer

function checkAnswer(rightanswer){
let answers=document.getElementsByName("question");
let choosenanswer;
for(let i=0; i<answers.length;i++){
if(answers[i].checked){
    choosenanswer=answers[i].dataset.answer;}}
if(choosenanswer===rightanswer){
rightanswers++;
}}


function handleBullets(){
    let bulletspans=document.querySelectorAll(".bullets .spans span ");
    let arrayofspans=Array.from(bulletspans);
    // if(currentindex>arrayofspans.length) return;
    arrayofspans.forEach((span,index)=>{
        if(currentindex===index){
        span.className="on";
        }
    });

}

function showResults(count){
    let score;
    let result;
        quizinfo.remove();
        quizarea.remove();
        answersarea.remove();
        submitbutton.remove();
        bullets.remove();

    //to display score even if user get 1 or 0
    score=`<span>You got ${rightanswers} from ${count} </span>`
    if(rightanswers>(count/2)&&rightanswers<count ){
        result=`<span class="good">Good</span>`
    }
    else if(rightanswers===count){
        result=`<span class="perfect"> Perfect.All your answers are correct</span>`
    }
    else{
        result=`<span class="bad"> Bad </span>`
    }
   
    results.innerHTML=`${score}<br>${result}`;
    results.style.padding="10px";
    results.style.backgroundColor="white";
    results.style.marginTop="10px"; 
    
}

function countdown(duration,count){
        let minutes,seconds;
        countdowninterval=setInterval(function(){
            minutes=parseInt(duration/60);
            seconds=parseInt(duration%60);

            minutes=minutes < 10 ?`0${minutes}`: minutes;
            seconds=seconds < 10 ?`0${seconds}` : seconds;

            countdownelement.innerHTML=`${minutes}:${seconds}`;
            if(duration<=0 ||currentindex===count) {
                clearInterval(countdowninterval);
                showResults(count);
            }
            duration--;
    },1000);
}
