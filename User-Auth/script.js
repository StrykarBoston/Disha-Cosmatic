const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');

signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
})

// Redirect to dashboard/Browse.html on Sign In form submit
// const signInFormElement = signInForm.querySelector('form');
// if(signInFormElement){
//     signInFormElement.addEventListener('submit', function(e){
//         e.preventDefault();
//         window.location.href = '/dashboard/Browse.html';
//     });
// }