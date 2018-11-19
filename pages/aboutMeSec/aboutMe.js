Page({
  data: {
    link: 'index'
  },
  onLoad(query) {
    console.log(query)
    if(query && query.link) {
      this.setData({
        link: query.link
      })
    }else {
      this.setData({
        link: 'index'
      })
    }
    // setTimeout(()=> {
    //   console.log('aaa')
    //   dd.redirectTo({
    //     url: 'aboutMe?link=employeesManager' 
    //   })
    // },5000)
  },
});
