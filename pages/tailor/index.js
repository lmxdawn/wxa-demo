
var self = null;
var num1 = 0;
Page({
    data: {
        i: 0,
        j: 0,
        num: 4,
        width: 300
    },

    onLoad: function () {
        self = this;
    },

    openAndDraw() {
        const ctx = wx.createCanvasContext('canvasIn', this);
        ctx.drawImage("http://localhost/643353_sdfaf123.png", 0, 0);
        ctx.draw()
    },

    export() {

        var i = this.data.i;
        var j = this.data.j;
        var num = this.data.num;
        var width = this.data.width;

        var w = parseInt(width / num);
        // 判断是不是正方形
        if (w * num !== width) {
            return false;
        }

        if (i === num - 1 && j >= num) {
            console.log("结束");
            return false;
        }

        if (j > num) {
            i++;
            j = 0;
        }

        var x = i * w;
        var y = j * w;

        j++;
        this.setData({
            i: i,
            j: j
        });

        const cfg = {
            x: 0,
            y: 0,
            width: w,
            height: w,
        };

        wx.canvasToTempFilePath({
            canvasId: 'canvasIn',
            ...cfg,
            success: (res) => {
                console.log(res);
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                        this.export();
                    },
                    fail: (err) => {
                        console.error(err)
                    }
                })
            },
            fail: (err) => {
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
