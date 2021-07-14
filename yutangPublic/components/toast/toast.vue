<template>
    <div class="toast" id="ydyshowTost_weiyi" v-if="showWrap" :class="showContent ?'fadein':'fadeout'">{{text}}</div>
</template>

<style scoped>
    .toast{
        position: fixed;
        left: 50%;
        top:50%;
        background: rgba(0,0,0,.6);
        padding: 10px 15px;
        border-radius: 5px;
        transform: translate(-50%,-50%);
        color:#fff;
        font-size:14px;
        z-index: 100;
    }
    .fadein {
        animation: animate_in 0.1s;
    }
    .fadeout {
        animation: animate_out 0.1s;
        opacity: 0;
    }
    @keyframes animate_in {
        0% {
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
    @keyframes animate_out {
        0% {
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
</style>
