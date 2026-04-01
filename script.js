

let flag = true;


const toggle = function ()
{
    const img = document.getElementById('#img');
     document.documentElement.classList.toggle("light-theme");
    if (flag)
    {
      
       let str = `img\\logo-stencil.svg`
        img.setAttribute('src', str);
        
       
        
         
    }
    else
    {
        let str =  'img\\logo-stencil-svgrepo-com.svg';
        img.setAttribute('src', str);
     
       
    }
    flag = !flag;
       
}

    document.getElementById("theme").addEventListener("click", () => toggle());