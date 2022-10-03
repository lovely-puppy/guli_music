window.onload = function(){
    document.addEventListener("touchstart", function(ev){
        ev = ev || event;
        ev.preventDefault();
    });
    (function(){
        let styleNode = document.createElement("style");
        let w = document.documentElement.clientWidth/16;
        styleNode.innerHTML = "html{font-size:"+w+"px!important}";
        document.head.appendChild(styleNode);
    })();

    changeFocus();
    function changeFocus(event){
        let inputText = document.querySelector('.wrap .head .headBottom form input[type="text"]');
        inputText.addEventListener('touchstart', function(){
            this.focus();
            this.stopPropagation();
            this.preventDefault();
        });
        document.addEventListener("touchstart", function(){
            inputText.blur();
        });
    }

    //头部按钮菜单切换
    CMCFMenuBtn();
    function CMCFMenuBtn() {
        let MenuBtn = document.querySelector('.wrap .head .headTop .menuBtn');
        let mask = document.querySelector('.wrap .head .mask');

        let isXX = false;
        MenuBtn.addEventListener("touchstart", function(ev){
            ev = ev || event;
            let touchC = ev.changedTouches[0];
            if (isXX){
                MenuBtn.classList.remove('active');
                mask.style.display = "none";
            }else{
                MenuBtn.classList.add('active');
                mask.style.display = "block";
            }
            isXX = !isXX;
            ev.stopPropagation();
            ev.preventDefault();
        });

        document.addEventListener('touchstart', function(){
            if (isXX){
                MenuBtn.classList.remove('active');
                mask.style.display = "none";
                isXX = !isXX;
            }
        });

        mask.addEventListener('touchstart', function(event){
            event.stopPropagation();
            event.preventDefault();
        });
    }

    //滑屏
    drag();
    function drag(){
        //滑屏区域
        let wrap = document.querySelector('.wrap .content .nav');
        //滑屏元素
        let item = document.querySelector('.wrap .content .nav .list');

        let startX = 0;
        let elementX = 0;
        let minX = wrap.clientWidth - item.offsetWidth;
        let disX = 0;

        let lastTime = 0;
        let lastPoint = 0;
        let timeDis = 1;
        let pointDis = 0;
        wrap.addEventListener("touchstart", function(event){
            let touchC = event.changedTouches[0];

            startX = touchC.clientX;
            elementX = item.offsetLeft;
            item.style.transition = "none";

            lastTime = new Date().getTime();
            // lastPoint = elementX;
            lastPoint = touchC.clientX;

            pointDis = 0;
            disX = 0;
        });

        wrap.addEventListener("touchmove", function(event){
            let touchC = event.changedTouches[0];
            let nowX = touchC.clientX;
            disX = nowX - startX;
            let translateX = elementX + disX;

            let nowTime = new Date().getTime();
            // let nowPoint = translateX;
            let nowPoint = touchC.clientX;
            timeDis = nowTime - lastTime;
            pointDis = nowPoint - lastPoint;
            console.log(pointDis);

            if (translateX > 0) {
                item.handMove = true;
                let scale = document.documentElement.clientWidth/((document.documentElement.clientWidth+translateX)*1.5);
                translateX = translateX + pointDis * scale;
                // translateX = elementX + disX * scale;
            } else if (translateX < minX) {
                item.handMove = true;
                let over = minX - translateX;
                let scale = document.documentElement.clientWidth/(document.documentElement.clientWidth+over);
                // translateX = elementX + disX * scale;
                translateX = translateX + pointDis * scale;
            }
            item.style.left = translateX + "px";

            lastTime = nowTime;
            lastPoint = nowPoint;
        });

        wrap.addEventListener("touchend", function(event){
            let translateX = elementX + disX;
            if (!item.handMove) {
                let speed = pointDis/timeDis;
                speed = Math.abs(speed)<0.5?0:speed;
                let targetX = translateX + speed * 150;
                // console.log(speed);

                let touchC = event.changedTouches[0];
                item.style.transition = "1s transform";
                
                let time = Math.abs(speed) * 0.3;
                time = time<0.8?0.8:time;
                time = time>2?2:time;
                let bsr = "";
                if (targetX > 0) {
                    targetX = 0;
                    bsr = "cubic-bezier(.26,1.51,.68,1.54) ";
                    //item.style.left = translateX + "px";
                } else if (targetX < minX) {
                    targetX = minX;
                    bsr = "cubic-bezier(.26,1.51,.68,1.54) ";
                    //item.style.left = translateX + "px";
                }
                item.style.transition = time +"s "+bsr;
                item.style.left = targetX + "px";
            } else {
                item.style.transition = "1s";
                if (translateX > 0){
                    translateX = 0;
                } else if (translateX < minX) {
                    translateX = minX;
                }
                item.style.left = translateX + "px";
                item.handMove = false;
            }
        });
    }
}