var albumNameArr = ["default"];  //相册列表
var albumPhotoList = {   //每一个相册有对应的数组
  "default": []
};

function albumAdd(alb) { //相册添加函数
  albumNameArr.push(alb);   //添加进相册列表
  albumPhotoList[alb] = []  //新增一个对应的数组
};

function photoAdd(alb,photo) {  //图片添加函数
  albumPhotoList[alb].push(photo);  //将图片添加到对应的数组
};


var albumTitle = document.querySelector(".album-title");  //当前的相册名
var albumList = document.querySelector(".album-list");  //相册列表区域
var photoList = document.querySelector(".photo-list");  //图片显示区域

var btnCreateAlbum = document.querySelector(".btn1");  //创建相册按钮
var btnAddPhoto = document.querySelector(".btn2");   //添加图片按钮
var btnAddPhotoinput = document.querySelector("#add-file");  //添加图片的表单

var pageNav = document.querySelector("nav>ul"); //分页区域

var currentAlbum = "default";  //默认相册
var currentPage = 1;   //默认显示第一页
var photoPerPage = 3;  //每页显示3张图片


btnCreateAlbum.addEventListener("click",function (event) {  //监听新建相册按钮的点击事件
  var albumName = prompt("请输入相册名")    //弹出一个对话框，可以返回输入的名字
  if(albumName != null && albumName != "" && albumName.trim() != "") {  //如果相册名不等于空
    albumAdd(albumName);   //调用相册添加函数
  };
  renderAlbumList(); //调用相册列表渲染函数
});


btnAddPhoto.addEventListener("click",function (event) {  //监听添加图片按钮事件
  btnAddPhotoinput.click();  //触发添加图片的表单的点击事件
  btnAddPhotoinput.onchange = function (event) {
    const file = btnAddPhotoinput.files[0];  //获取上传文件信息
    const fr = new FileReader(); //生成一个读取器
    fr.onload = function () {  //读取成功后触发onload函数
      let img = new Image();   //生成一个图片元素
      img.src = fr.result;   //将读取后的结果赋值给图片的src属性
      uploadPhoto(img);   //调用图片上传函数
    };
    fr.readAsDataURL(file);   //读取文件数据然后进行转换
  }
})


function renderAlbumList() {   //相册列表渲染函数
  albumList.innerHTML = "";  //清空相册列表
  albumNameArr.forEach(albName=>{
    let album = document.createElement("li");   //创建一个li元素
    let albumLink = document.createElement("a");  //创建一个a元素
    let btnDelAlbum = document.createElement("button");  //创建一个删除按钮
    btnDelAlbum.className = "btn-del-album";  //设置按钮的class属性
    btnDelAlbum.innerText = "X";   //文本为 X


    albumLink.addEventListener("click",function (event) {   //监听a元素的点击事件
      let albumList_li = document.querySelectorAll(".album-list li");  //相册列表区域的li元素
      let albumList_a = document.querySelectorAll(".album-list a");   //相册列表区域的a元素

      albumList_li.forEach(li=>{
        li.style.backgroundColor = "";
      });

      albumList_a.forEach(a=>{
        a.style.color = "#2C70DD";
      })

      album.style.backgroundColor = "#C2C2C2";
      albumLink.style.color = "white";
      currentPage = 1;  //页数为第一页
      currentAlbum = albName; //切换相册名
      renderPhotoList();  //调用图片显示区域渲染函数
      // pagination();   //调用分页函数
      albumTitle.innerText = currentAlbum;   //显示当前的相册名
    });

    btnDelAlbum.addEventListener("click",function (event) {  //监听相册删除按钮
      let name = albumLink.innerText;  //获取a元素的文本
      let index = albumNameArr.indexOf(name);   //在相册列表中查询文本的位置
      albumNameArr.splice(index,1);  //用splice方法删除对应的相册
      delete albumPhotoList[name];  //删除对应的数组
      if(currentAlbum === name ){
        albumTitle.innerText = "";  //清空当前的相册名
      }
      currentPage = 1;    //页数为第一页
      renderPhotoList();  //调用图片区域渲染函数
      renderAlbumList();  //调用相册列表渲染函数
    });

    albumLink.innerText = albName;  //将相册名赋值给a元素的文本
    albumLink.href = "#";            //链接地址默认为空

    album.appendChild(albumLink);   //将a元素加入li元素
    album.appendChild(btnDelAlbum); //将删除按钮加入li元素
    albumList.appendChild(album);   //将li元素加入相册列表
  })
}



  function renderPhotoList() {  //图片显示区域渲染函数
    photoList.innerHTML = "";  //清空所有图片
    let currentImg = [];   //当前要显示的图片
    for(let i=(currentPage-1)*photoPerPage; i<currentPage*photoPerPage; i++){ //根据页数获取相对应的图片
      if(albumPhotoList[currentAlbum] && albumPhotoList[currentAlbum][i] !== undefined && albumPhotoList[currentAlbum][i] !== null){
          currentImg.push(albumPhotoList[currentAlbum][i])   //将相册的图片加入当前要显示的图片的数组
      }else{
        console.log("没有图片")
      }
    }

    currentImg.forEach(img=>{
      let photo = document.createElement("div");  //新建一个div元素
      let button = document.createElement("button");  //新建一个删除按钮
      button.innerText = "X";    //按钮的文本设置为 X

      button.addEventListener("click",function (event) {  //监听删除按钮的点击事件
          let index = albumPhotoList[currentAlbum].indexOf(img);  //查找图片的位置
          albumPhotoList[currentAlbum].splice(index,1);  //在相册的数组中删除图片
          // pagination();  //调用分页函数
          renderPhotoList();  //调用图片区域渲染函数
        });


      photo.className = "photo";   //将div元素的class属性设置成 photo
      photo.appendChild(img); //将图片加入div元素
      photo.appendChild(button);  //将按钮加入div元素
      photoList.appendChild(photo);  //将div元素加入图片显示区域
    });
}

function uploadPhoto(photo) {  //上传图片函数
  photoAdd(currentAlbum,photo); //调用图片添加函数
  // pagination(); //调用分页函数
  renderPhotoList();  //调用图片区域渲染函数
}

function pagination() {   //分页函数
  pageNav.innerHTML = "";  //清空分页区域
  let pageNavFirstLink = document.createElement("a"); //新建第一页的a元素
  let pageNavLastLink = document.createElement("a");  //新建最后一页的a元素
  let pageNavFirst = document.createElement("li");  //新建第一页的li元素
  let pageNavLast = document.createElement("li");  //新建最后一页的li元素

  pageNavFirstLink.innerText = "First";  //设置第一页的a元素的文本为First
  pageNavLastLink.innerText = "Last";   //设置最后一页的a元素的文本为Last

  let length = albumPhotoList[currentAlbum].length;  //获取当前相册的图片数量

  pageNavFirstLink.addEventListener("click",function (event) {  //监听第一页的a元素的点击事件
    currentPage = 1;   //当前的页数切换为第一页
    renderPhotoList();   //调用图片区域渲染函数
  });

  pageNavLastLink.addEventListener("click",function (event) {  //监听最后一页的a元素的点击事件
    currentPage = length/photoPerPage > 0 ? Math.ceil(length/photoPerPage) : 1;  //判断当前的页数
    renderPhotoList();  //调用图片区域渲染函数
  });

  pageNavFirst.appendChild(pageNavFirstLink); //将第一页的a元素加入第一页的li元素
  pageNavLast.appendChild(pageNavLastLink);  //将最后一页的a元素加入最后一页的li元素
  pageNav.appendChild(pageNavFirst);  //将第一页的li元素加入分页区域

  for(let i=0; i<length/photoPerPage; i++){  //for循环，i<图片的总数/每页显示的数量(3)
    let pageNavLink = document.querySelector("a");  //新建一个a元素
    let pageNavLi = document.querySelector("li");  //新建一个li元素
    pageNavLink.innerText = `${i+1}`;   //设置a元素显示的页数
    pageNavLink.onclick = function () {  //监听a元素的点击事件
      currentPage = i+1;  //切换当前的页数
      renderPhotoList();  //调用图片显示区域渲染函数
    }
    pageNavLi.appendChild(pageNavLink);   //将a元素加入li元素
    pageNav.appendChild(pageNavLi);   //将li元素加入分页区域
  }
  pageNav.appendChild(pageNavLast); //将最后一页的li元素加入分页区域
}

renderAlbumList();
