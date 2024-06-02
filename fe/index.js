let prompts = [
  {
    text: "Xin chào, tôi tên là [Tên của bạn]. Tôi sống ở [Thành phố của bạn] và làm việc trong lĩnh vực [Ngành nghề của bạn].",
    timeToSpeak: 9.857142857142858
  },
  {
    text: "Tôi thích đọc sách và đi du lịch. Đọc sách giúp tôi thư giãn, còn du lịch mang lại cho tôi những trải nghiệm mới.",
    timeToSpeak: 8.571428571428571
  },
  {
    text: "Mỗi ngày, tôi bắt đầu làm việc lúc 8 giờ sáng. Tôi thường họp, xử lý email và hoàn thành các nhiệm vụ trong ngày.",
    timeToSpeak: 8.571428571428571
  },
  {
    text: "Kỳ nghỉ đáng nhớ nhất của tôi là chuyến đi đến Đà Nẵng. Tôi đã thăm Bà Nà Hills và thưởng thức các món ăn địa phương.",
    timeToSpeak: 9.857142857142858
  },
  {
    text: "Mục tiêu của tôi trong năm tới là học thêm một ngôn ngữ lập trình mới và tham gia nhiều dự án thú vị hơn.",
    timeToSpeak: 9.428571428571429
  },
  {
    text: "Gần đây, tôi đã học cách nấu ăn. Món ăn đầu tiên tôi nấu là món spaghetti và nó rất ngon.",
    timeToSpeak: 7.714285714285714
  },
  {
    text: "Cuốn sách yêu thích của tôi là 'Nhà giả kim' của Paulo Coelho. Nó mang đến nhiều bài học quý giá về cuộc sống.",
    timeToSpeak: 7.714285714285714
  },
  {
    text: "Thành tựu tôi tự hào nhất là tốt nghiệp đại học với điểm số cao. Đó là kết quả của sự nỗ lực không ngừng.",
    timeToSpeak: 8.142857142857142
  },
  {
    text: "Người tôi ngưỡng mộ nhất là cha tôi. Ông luôn làm việc chăm chỉ và không ngừng học hỏi.",
    timeToSpeak: 7.285714285714286
  },
  {
    text: "Cuối tuần này, tôi sẽ đi dã ngoại cùng gia đình. Chúng tôi dự định sẽ chơi thể thao và tổ chức một buổi picnic.",
    timeToSpeak: 9.0
  },
  {
    text: "Một thử thách lớn mà tôi đã vượt qua là học lái xe. Ban đầu rất khó khăn, nhưng cuối cùng tôi đã làm được.",
    timeToSpeak: 8.142857142857142
  }
]

let constraintObj = {
  audio: {
    echoCancellation: true, // Tắt tính năng loại bỏ vọng
    autoGainControl: false, // Tắt tính năng điều chỉnh tăng âm tự động
    noiseSuppression: false // Tắt tính năng khử tiếng ồn
  },
  video: {
    facingMode: "user",
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
  },
};

if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
  navigator.mediaDevices.getUserMedia = function (constraintObj) {
    let getUserMedia =
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraintObj, resolve, reject);
    });
  };
} else {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        console.log(device.kind.toUpperCase(), device.label);
      });
    })
    .catch((err) => {
      console.log(err.name, err.message);
    });
}

let randomPromptElement;

document.addEventListener("DOMContentLoaded", function () {
  console.log("asasxas");
  randomPromptElement = getRandomPromt(prompts);
  document.getElementById("randomPrompt1").innerText = randomPromptElement.text;
  document.getElementById("randomPrompt2").innerText = randomPromptElement.text;

  document.getElementById("record").addEventListener("click", async () => {
    document.getElementById("prompt").style.visibility = "hidden";
    document.getElementById("capture").style.visibility = "visible";

    try {
      await record(randomPromptElement);
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
    }
  });

  // document.getElementById("continueRecord").addEventListener("click", () => {
  //   document.getElementById("prompt").style.visibility = "visible";
  //   document.getElementById("capture").style.visibility = "hidden";

  //   randomPromptElement = getRandomPromt(prompts);
  //   document.getElementById("randomPrompt1").innerText =
  //     randomPromptElement.text;
  //   document.getElementById("randomPrompt2").innerText =
  //     randomPromptElement.text;
  // });
});

function newRandomPromt() {
  document.getElementById("prompt").style.visibility = "visible";
  document.getElementById("capture").style.visibility = "hidden";

  randomPromptElement = getRandomPromt(prompts);
  document.getElementById("randomPrompt1").innerText =
    randomPromptElement.text;
  document.getElementById("randomPrompt2").innerText =
    randomPromptElement.text;
}

function getRandomPromt(arr) {
  let randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

function record(rd) {
  return new Promise((resolve) => {
    navigator.mediaDevices
      .getUserMedia(constraintObj)
      .then(function (mediaStreamObj) {
        let video = document.querySelector("video");
        if ("srcObject" in video) {
          video.srcObject = mediaStreamObj;
        } else {
          // cho phien ban cu
          video.src = window.URL.createObjectURL(mediaStreamObj);
        }

        video.onloadedmetadata = function (ev) {
          // hien hinh anh dang ghi bang webcam trong the video dau tien
          video.play();
        };

        // lang nghe su kien
        let mediaRecorder = new MediaRecorder(mediaStreamObj, {
          mimeType: "video/webm;codecs=vp9,opus",
          audioBitsPerSecond: 128000,
          sampleRate: 48000,
          channelCount: 2,
        });
        let chunks = [];

        setTimeout(1500);
        // Sự kiện bắt đầu nói
        mediaRecorder.start();

        // Sự kiện kết thúc nói
        setTimeout(function() {
          mediaRecorder.stop();
          mediaStreamObj.getTracks().forEach((track) => track.stop());
          newRandomPromt();
        }, rd.timeToSpeak*1000);

        mediaRecorder.ondataavailable = function (ev) {
          chunks.push(ev.data);
        };

        mediaRecorder.onstop = (ev) => {
          let blob = new Blob(chunks, { type: "video/mp4" });
          uploadVideo(blob);
        };

      })
      .catch(function (err) {
        console.log(err.name, err.message);
      });
  });
}

async function uploadVideo(blob) {
  const formData = new FormData();
  formData.append("video", blob, "video.mp4");

  try {
    const response = await fetch("http://localhost:8080/videos/upload", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      console.log(response.body);
    } else {
      console.error(response.body);
    }
  } catch (error) {
    console.error("Loi upload video: ", error);
  }
}
