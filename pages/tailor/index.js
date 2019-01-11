
var self = null;
var num1 = 0;

function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

Page({
    data: {
        i: 0,
        j: 0,
        num: 4,
        width: 300,
        imageList: [],
        newImageList: [] // 排序好了的数组
    },

    onLoad: function () {
        self = this;
    },

    openAndDraw() {

        // 清空数据
        this.setData({
            i: 0,
            j: 0,
            imageList: [],
            newImageList: []
        });

        const ctx = wx.createCanvasContext('canvasIn', this);
        wx.chooseImage({
            success(res) {
                ctx.drawImage(res.tempFilePaths[0], 0, 0, 300, 300);
                ctx.draw()
            }
        })
    },

    export() {

        var i = this.data.i;
        var j = this.data.j;
        var num = this.data.num;
        var count = this.data.count;
        var width = this.data.width;

        var w = parseInt(width / num);
        // 判断是不是正方形
        if (w * num !== width) {
            return false;
        }

        if (i === num - 1 && j >= num) {
            console.log("结束");
            var list = [];
            // 这里可以重新排序
            for (var index in self.data.imageList) {
                var data = {
                    imagePath: null,
                    count: null
                };
                data.imagePath = self.data.imageList[index].imagePath;
                data.count = self.data.imageList[index].count;
                list.push(data);
            }

            list.sort(compare('count'));

            console.log(list);

            this.setData({
                i: 0,
                j: 0,
                newImageList: list
            });
            return false;
        }

        if (j > num - 1) {
            i++;
            j = 0;
        }

        var x = i * w;
        var y = j * w;
        console.log(i,j);

        const cfg = {
            x: x,
            y: y,
            width: w,
            height: w,
        };
        wx.canvasToTempFilePath({
            canvasId: 'canvasIn',
            ...cfg,
            success: (res) => {
                var list = [];
                for (var index in self.data.imageList) {
                    var data = {
                        imagePath: self.data.imageList[index].imagePath,
                        count: self.data.imageList[index].count
                    };
                    list.push(data);
                }
                var data = {
                    imagePath: res.tempFilePath,
                    count: parseInt("" + j + i)
                };
                list.push(data);

                // 修改数据
                j++;
                self.setData({
                    i: i,
                    j: j,
                    imageList: list
                });
                
                // 递归执行
                this.export();
                // wx.saveImageToPhotosAlbum({
                //     filePath: res.tempFilePath,
                //     success: (res) => {
                //         this.export();
                //     },
                //     fail: (err) => {
                //         console.error(err)
                //     }
                // })
            },
            fail: (err) => {
                this.setData({
                    i: 0,
                    j: 0,
                    imageList: []
                });
                console.log(err);
            }
        }, this);

        // wx.canvasToTempFilePath({
        //     canvasId: 'canvasIn',
        //     ...cfg,
        //     success: (res) => {
        //         console.log(res);
        //         // this.export();
        //     },
        //     fail: (err) => {
        //         console.log(err);
        //     }
        // }, this);

        // for(var i = 0; i < num; i++) {
        //     for(var j = 0; j < num; j++) {
        //         var x = i * w;
        //         var y = j * w;
        //         cfg.x = x;
        //         cfg.y = y;
        //     }
        // }

    },
    getImage(cfg, cb){
        wx.canvasToTempFilePath({
            canvasId: 'canvasIn',
            ...cfg,
            success: (res) => {
                console.log(res);
                cb(res.tempFilePath);
            },
            fail: (err) => {
                cb(null);
            }
        }, this);
    },
    ss(cfg, cb) {
        wx.canvasGetImageData({
            canvasId: 'canvasIn',
            ...cfg,
            success: (res) => {
                const data = res.data;
                wx.canvasPutImageData({
                    canvasId: 'canvasOut',
                    data,
                    ...cfg,
                    success: (res) => {
                        self.export();
                    },
                    fail: (err) => {
                        cb(false, err)
                    }
                })
            },
            fail: (err) => {
                cb(false, err)
            }
        })
    },
    process() {
        const cfg = {
            x: 20,
            y: 20,
            width: 50,
            height: 50,
        };

        var num = 4;

        // this.ss(cfg, function (is, path) {
        //     console.log(111);
        //     wx.saveImageToPhotosAlbum({
        //         filePath: path,
        //         success: (res) => {
        //             console.log(res)
        //         },
        //         fail: (err) => {
        //             console.error(err)
        //         }
        //     })
        // })

    }
})
