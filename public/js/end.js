document.addEventListener('scroll', function(){
    if (window.scrollY<332){
        document.getElementById("btn2top").style.display = 'none';
    }
    else{
        document.getElementById("btn2top").style.display = 'block';
    }
  })

  document.getElementById('btn2top').addEventListener('click', function(){
    window.scrollTo(0, 0); 
  })
    
