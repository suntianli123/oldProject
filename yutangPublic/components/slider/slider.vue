<template>
    <div class="progress-bar">
        <div class="bar-inner" ref="progressBar">
            <div class="buffered" ref="bufferedLength" v-bind:style="{'width':bufferedLength+'%'}"></div>
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd"
            >
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import toast from '../toast/index';
    export default {
        props: {
            percent: {
                type: Number,
                default: 0
            },
	        bufferedLength: {
		        type: Number,
		        default: 0
	        },
	        dragFlag:{
		        type: Boolean,
		        default: false
            }
        },
        created() {
            this.touch = {};
        },
        methods: {
            progressTouchStart(e) {
	            if(this.dragFlag){
		            return;
	            }
                this.touch.initiated = true;
                this.touch.startX = e.touches[0].pageX;
                this.touch.left = this.$refs.progress.clientWidth;
                this.$emit('percentChangStart', this._getPercent());
            },
            progressTouchMove(e) {
            	if(this.dragFlag){

		            return;
                }

                if (!this.touch.initiated) {
                    return;
                }
                const deltaX = e.touches[0].pageX - this.touch.startX;
                const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth, Math.max(0, this.touch.left + deltaX));
                this._offset(offsetWidth);
                this.$emit('percentChanging', this._getPercent());
            },
            progressTouchEnd() {
	            if(this.dragFlag){
                    this.$emit('dragAndDrop', true);
		            return;
	            }

                this.touch.initiated = false;
                this._triggerPercent();
            },
            progressClick(e) {
	            if(this.dragFlag){
		            return;
	            }

                e.preventDefault();

                let clickWidth = e.offsetX;
                let maxWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth;
                if(clickWidth > maxWidth){
                    clickWidth = maxWidth;
                }
                this._offset(clickWidth);
                this._triggerPercent();

            },
            setProgressOffset(percent) {
            	if(!percent || !this.touch){
            		return
                }

                if (percent >= 0 && !this.touch.initiated) {
                    const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth;
                    const offsetWidth = percent * barWidth;
                    this._offset(offsetWidth);
                }
            },
            _triggerPercent() {
                this.$emit('percentChange', this._getPercent());
            },
            _offset(offsetWidth) {
                this.$refs.progress.style.width = `${offsetWidth}px`;
                this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
            },
            _getPercent() {
                const barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth;
                return this.$refs.progress.clientWidth / barWidth;
            }
        },
	    mounted () {
		    this.setProgressOffset(this.percent);
	    },
        watch: {
            percent(){
	            this.setProgressOffset(this.percent);
//            	handler(n,o) {
//		            this.setProgressOffset(this.percent);
//	            }
//                immediate:true
            }
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '~styles/varibles.styl'
    .progress-bar
        height: 3*$rex
        .bar-inner
            position: relative
            top: 1.2*$rex
            height: .6*$rex
            border-radius .3*$rex
            background: rgba(0, 0, 0, 0.1)
            .buffered{
                position: absolute
                height: 100%
                border-radius .3*$rex
                background: rgba(0,0,0,0.2);
            }
            .progress
                position: absolute
                height: 100%
                background: #00CB72
                border-radius .3*$rex
            .progress-btn-wrapper
                position: absolute
                width: 2*$rex
                height: 2*$rex
                border: .6*$rex solid #00CB72
                border-radius: 50%
                box-sizing: border-box
                top: 0
                bottom: 0
                margin auto
                left: -.8*$rex
                background: #fff

</style>



// WEBPACK FOOTER //
// src/base/progress-bar/progress-bar.vue
