<template>
  <div class="my-hintpage">
    <div class="title-icon" v-if="isTiconShow">
      <span class="icon"
      :style="{
        'width':ticonStyle.width,
        'height':ticonStyle.height,
        'background':`transparent url(${ticonUrl}) no-repeat`,
        'backgroundPosition':ticonStyle.backgroundPosition
      }"></span>
    </div>
    <div class="operate" v-if="isMsgShow">
      <span class="err-msg" :style="{'color':msgStyle.color}">
      {{ msgText }}</span>
    </div>
    <template class="customer">
      <slot name="customer-msg"></slot>
    </template>
    <div class="bottom-icon" v-if="isBiconShow"
    :style="{
      'width':biconStyle.width,
      'height':biconStyle.height,
      'backgroundSize':biconStyle.backgroundSize,
      'background':`transparent url(${biconUrl}) no-repeat center center`,
    }">
    </div>
  </div>
</template>

<script>
export default {
  name:'my-hintpage',
  props:{
    // 头部图标是否显示
    isTiconShow:{
      type: Boolean,
      default: true
    },

    // 头部图标图片路径
    ticonUrl:{
      type:String,
      default: require('@/../static/img/11.png')
    },

    // 默认头部图标图片样式
    ticonStyle:{
      type:Object,
      default: () => {
        return {
          width:'110px',
          height:'90px',
          backgroundPosition: '-12px -250px'
        }
      }
    },

    // 底部背景图片是否显示
    isBiconShow:{
      type: Boolean,
      default: true
    },

    // 底部背景图片路径
    biconUrl:{
      type:String,
      default: require('@/../static/img/zwq-zwkt.jpg'),
    },

    // 默认底部背景图片样式
    biconStyle:{
      type:Object,
      default: () => {
        return {
          width:'100%',
          height:'130px',
          backgroundSize: 'auto auto'
        }
      }
    },

    // 默认提示语内容
    msgText:{
      type:String,
      default: '',
    },

    // 默认提示语是否显示
    isMsgShow:{
      type: Boolean,
      default: true
    },

    // 默认提示语样式
    msgStyle:{
      type:Object,
      default: () => {
        return {
          color:'',
          fontSize:'',
        }
      }
    }
  }
}
</script>

<style scoped>
.my-hintpage{
  width:100%;
  height:auto;
  padding:40px 0;
}
.title-icon {
  width:100%;
  height:auto;
  text-align: center;
}
.title-icon .icon {
  width:110px;
  height:90px;
  display:inline-block;
}
.operate{
  width:100%;
  height:auto;
  margin-top: 30px;
  text-align: center;
}
.err-msg{
  color:#000;
  font-size:18px;
  line-height:30px;
}
.bottom-icon {
  width:100%;
  height:130px;
  margin-top: 40px;
  background-size: 'auto auto'
}
</style>
