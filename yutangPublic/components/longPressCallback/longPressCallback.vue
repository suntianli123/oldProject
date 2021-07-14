<template>
    <!---长按事件上报 成功回掉--->
    <div>
        <img @touchstart="touchstartFun()" @touchend="touchendFun()" :src="img" alt="">
    </div>
</template>

<script type="text/ecmascript-6">
	export default {
		name: '',
		props: {
			img: String,
			callback: Function,
		},
		data () {
			return {
				booler: false,
				setObj: null,
				timer: 500,
				numTimer:0
			};
		},
		methods: {
			touchstartFun(){
				this.booler = true;
				this.setTimeOutFun();
			},
			touchendFun(){
				this.booler = false
			},
			setTimeOutFun(){
				let that = this;
				setTimeout(function () {
					if(that.booler){
						that.numTimer+= 100;
						if(that.numTimer<=that.timer){
							that.setTimeOutFun();
						}else{
							that.numTimer = 0;
							that.callback();
						}
					}
				},100)
            }
		},
		mounted () {
		}
	};
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
    img{
        width: 100%;
    }

</style>