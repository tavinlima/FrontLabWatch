let form = document.querySelector('.color_mode');

    form.addEventListener('change', (e) => {
        let mode = e.target.value;

        if(mode === 'dark'){
            document.documentElement.classList.toggle('dark_mode');

        }else{
            document.documentElement.classList.toggle('dark_mode');

        }
    })