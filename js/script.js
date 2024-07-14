let myData=document.querySelector("#myData");
let searchInput=document.querySelector("#searchInput");
let submitBtn;


// ^ WHEN READY DISPPLAY MEALS 

$(document).ready(()=>{
    searchByName("").then(()=>{
        $(".loading").fadeOut(500);
    })
})


// ^ SEARCH


function displaySearchInput(){
    searchInput.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    myData.innerHTML = ""

}

// & SEARCH BY NAME


async function searchByName(term) {
    closeNavBar()
    myData.innerHTML = ""
    $(".inner-loading").fadeIn(400)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()
    if(response.meals){
        displayMeals(response.meals)
    }
    else{
        displayMeals([])
    }


    $(".inner-loading").fadeOut(400)

}

// & SEARCH BY FIRST LETTER

async function searchByFirstLetter(term) {
    closeNavBar()
    myData.innerHTML = ""
    $(".inner-loading").fadeIn(400)

    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    if(response.meals){
        displayMeals(response.meals)
    }
    else{
        displayMeals([])
    }
    $(".inner-loading").fadeOut(400)

}

// ^ ADD EVENTLISTENER TO SEARCH IN SIDEBAR

$("#search").on("click",displaySearchInput)
$("#search").on("click",closeNavBar)

// ! SIDE NAV BAR

// & OPEN NAV BAR

function openNavBar(){
    $(".side-nav-bar").animate({
        left:0
    },500)

    $(".openCloseIcon").removeClass("fa-align-justify");
    $(".openCloseIcon").addClass("fa-x");
    
    

}

// & CLOSE NAV BAR

function closeNavBar(){
    let navBox=$(".side-nav-bar .nav-tab").outerWidth()
    $(".side-nav-bar").animate({
        left:-navBox
    },500)

    $(".openCloseIcon").addClass("fa-align-justify");
    $(".openCloseIcon").removeClass("fa-x");

    
}
closeNavBar()


$(".side-nav-bar .openCloseIcon").click(()=>{
    if ($(".side-nav-bar").css("left") == "0px") {
        closeNavBar()
    } else {
        openNavBar()
    }
})


// ^ Meals

// & GET MEAL DETAILS 

async function getMealDetails(mealID) {
    closeNavBar()
    myData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    searchInput.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])
    $(".inner-loading").fadeOut(300)
    

}

// & DISPLAY MEAL DETAILS 

function displayMealDetails(meal) {
    
    searchInput.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-1 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    
    if (!tags) tags = []

    let tagsStr = " "
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-2 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-2 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success me-2">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    myData.innerHTML = cartoona
}



// & DISPLAY MEAL
function displayMeals(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="">
                    <div class="meal-overlayer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    myData.innerHTML = cartoona
}

//  ^ INGREDIENT SECTION 


// & Get INGREDIENT

async function getIngredients(){
    myData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    searchInput.innerHTML=""

    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    response=await response.json()
    // console.log(response.meals);

    displayIngredients(response.meals.slice(0, 20))
    $(".inner-loading").fadeOut(400)

}
// & DISPLAY INGREDIENT SECTION

function displayIngredients(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    myData.innerHTML = cartoona
}

// ^ ADD EVENTLISTENER TO INGREDIENT IN SIDEBAR

$("#ingredients").on("click",getIngredients)
$("#ingredients").on("click",closeNavBar)


// & WHEN CLICK DISPLAY RECEPIE DETAILS

async function getIngredientsMeals(ingredient){
    myData.innerHTML=""
    $(".inner-loading").fadeIn(400)

    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    response=await response.json()
    console.log(response.meals);

    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading").fadeOut(400)

}

// ^ CATEGORY SECTION

// & GET CATEGORY

async function getCategory(){
    myData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    searchInput.innerHTML="";

    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response=await response.json()
    console.log(response.categories);

    displayCategory(response.categories)
    $(".inner-loading").fadeOut(400)

}

// & DISPLAY CATEGORY

function displayCategory(arr){
    let cartoona=''
    for (let i = 0; i < arr.length; i++){
        cartoona+=`      <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-overlayer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0,12).join(" ")}</p>
                    </div>
                </div>
        </div>`
    }

    myData.innerHTML=cartoona
}

// ^ ADD EVENTLISTENER TO CATEGORY IN SIDEBAR

$("#category").on("click",getCategory)
$("#category").on("click",closeNavBar)


// & WHEN CLICK DISPLAY RECEPIE DETAILS


async function getCategoryMeals(category){
    myData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    

    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response=await response.json()
    console.log(response.meals);

    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading").fadeOut(400)

}


// ^ AREA SECTION


// & GET AREA


async function getArea(){
    myData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    searchInput.innerHTML="";

    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    response=await response.json()
    console.log(response.meals);

    displayArea(response.meals)
    $(".inner-loading").fadeOut(400)

}


// & DISPLAY AREA

function displayArea(arr){
    let cartoona=''
    for (let i = 0; i < arr.length; i++){
        cartoona+=`<div class="col-md-3">
                        <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded rounded-2 text-center cursor-pointer">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3>${arr[i].strArea}</h3>
                        </div>

                    </div>`
    }

    myData.innerHTML=cartoona
}

// ^ ADD EVENTLISTENER TO AREA IN SIDEBAR

$("#area").on("click",getArea)
$("#area").on("click",closeNavBar)


// & WHEN CLICK DISPLAY RECEPIE DETAILS


async function getAreaMeals(area){
    myData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    

    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response=await response.json()
    console.log(response.meals);

    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading").fadeOut(400)

}

// ^ CONTACT US SECTION


// & DISPLAY CONTACT US


function displayContact(){
    myData.innerHTML=`<div class="contact min-vh-100 d-flex justify-content-center align-items-center ">
                        <div class="container w-75">
                            <div class="row gy-4">
                                <div class="col-md-6">
                                    <input onkeyup="formValidation()" type="text" id="nameInput" class="form-control" placeholder="Enter Your Name">
                                    <div id="NameAlert" class="alert alert-danger w-100 mt-3 d-none">Special Characters Not Allowed</div>

                                </div>  
                                <div class="col-md-6">
                                    <input onkeyup="formValidation()"  type="email" id="emailInput" class="form-control" placeholder="Enter Your Email">
                                    <div id="EmailAlert" class="alert alert-danger w-100 mt-3 d-none">Email not valid *example:@yyyy.zzz</div>

                                </div>                          
                                <div class="col-md-6">
                                    <input onkeyup="formValidation()"  type="number" id="phoneInput" class="form-control" placeholder="Enter Your Phone">
                                    <div id="PhoneAlert" class="alert alert-danger w-100 mt-3 d-none">Enter valid phone number</div>

                                </div>
                                <div class="col-md-6">
                                    <input onkeyup="formValidation()"  type="number" id="ageInput" class="form-control" placeholder="Enter Your age">
                                    <div id="ageAlert" class="alert alert-danger w-100 mt-3 d-none">Enter valid age number</div>

                                </div> 
                                <div class="col-md-6">
                                    <input onkeyup="formValidation()"  type="password" id="password" class="form-control" placeholder="Enter Your password">
                                    <div id="passwordAlert" class="alert alert-danger w-100 mt-3 d-none">Enter valid password *Minimum eight characters, at least one letter and one number and one special charachter</div>

                                </div>
                                <div class="col-md-6">
                                    <input onkeyup="formValidation()"  type="password" id="repasswordInput" class="form-control" placeholder="Repassword">
                                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-3 d-none">Enter valid repassword</div>

                                </div>
                                
                            </div>
                            <div class="d-flex justify-content-center align-items-center">
                                <button class="btn btn-outline-danger px-2 mt-3" disabled id="submitBtn"> Submit</button>
                            </div>
                           
                            
                        </div>
                     </div>`

                     
// & WHEN FOCUS IF INPUT IS NOT NULL


                     submitBtn=document.querySelector("#submitBtn")
                     document.querySelector("#nameInput").addEventListener("focus",()=>{
                        // console.log("name");
                        nameInputfocus=true;
                     })
                     document.querySelector("#emailInput").addEventListener("focus",()=>{
                        emailInputfocus=true;
                     })
                     document.querySelector("#phoneInput").addEventListener("focus",()=>{
                        phoneInputfocus=true;
                     })
                     document.querySelector("#ageInput").addEventListener("focus",()=>{
                        ageInputfocus=true;
                     })
                     document.querySelector("#password").addEventListener("focus",()=>{
                        passwordInputfocus=true;
                     })
                     document.querySelector("#repasswordInput").addEventListener("focus",()=>{
                        repasswordInputfocus=true;
                     })
}
let nameInputfocus=false;
let emailInputfocus=false;
let phoneInputfocus=false;
let ageInputfocus=false;
let passwordInputfocus=false;
let repasswordInputfocus=false;

// ^ ADD EVENTLISTENER TO CONTACT US IN SIDEBAR

$("#contact").on("click",displayContact)
$("#contact").on("click",closeNavBar)


// & VALIDATION 


function validationName(){
    return(/^[a-zA-Z ]+$/.test(document.querySelector("#nameInput").value))
}
function validationEmail(){
    return(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(document.querySelector("#emailInput").value))
}
function validationPhone(){
    return(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.querySelector("#phoneInput").value))
}
function validationAge(){
    return(/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.querySelector("#ageInput").value))
}
function validationPassword(){
    return(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(document.querySelector("#password").value))
}
function validationRepassword(){
    return document.querySelector("#repasswordInput").value == document.querySelector("#password").value
}

// * CHECK VALIDATION AND DISPLAY ALERT

function formValidation(){
    if(nameInputfocus){
        if(validationName()){
            document.querySelector("#NameAlert").classList.replace("d-block","d-none")
        }
        else{
            document.querySelector("#NameAlert").classList.replace("d-none","d-block")
        }
    }
    if(emailInputfocus){
        if(validationEmail()){
            document.querySelector("#EmailAlert").classList.replace("d-block","d-none")
        }
        else{
            document.querySelector("#EmailAlert").classList.replace("d-none","d-block")
        }
    }
    if(phoneInputfocus){
        if(validationPhone()){
            document.querySelector("#PhoneAlert").classList.replace("d-block","d-none")
        }
        else{
            document.querySelector("#PhoneAlert").classList.replace("d-none","d-block")
        }
    }
    if(ageInputfocus){
        if(validationAge()){
            document.querySelector("#ageAlert").classList.replace("d-block","d-none")
        }
        else{
            document.querySelector("#ageAlert").classList.replace("d-none","d-block")
        }
    }
    if(passwordInputfocus){
        if(validationPassword()){
            document.querySelector("#passwordAlert").classList.replace("d-block","d-none")
        }
        else{
            document.querySelector("#passwordAlert").classList.replace("d-none","d-block")
        }
    }
    if(repasswordInputfocus){
        if(validationRepassword()){
            document.querySelector("#repasswordAlert").classList.replace("d-block","d-none")
        }
        else{
            document.querySelector("#repasswordAlert").classList.replace("d-none","d-block")
        }
    }


    // ! SUBMIT BTN ABLE
    
    if(validationName()&& validationEmail()&& validationAge()&& validationPhone() && validationPassword() && validationRepassword()){
        submitBtn.removeAttribute("disabled")
    }else{
        submitBtn.addAttribute("disabled")
    }
}




