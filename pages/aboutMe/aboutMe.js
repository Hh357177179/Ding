Page({
  data: {
    link: 'index'
  },
  onShow(query) {
    console.log(query)
    if(query && query.link) {
      this.setData({
        link: query.link
      })
    }else {
      this.setData({
        link: 'index.html'
      })
    }
    console.log('this.link')
    console.log(this.data.link)
    // setTimeout(()=> {
    //   console.log('aaa')
    //   dd.redirectTo({
    //     url: 'aboutMe?link=employeesManager' 
    //   })
    // },5000)
  },
});
