let prompts = [
  "Xin chào, tôi tên là [Tên của bạn]. Tôi sống ở [Thành phố của bạn] và làm việc trong lĩnh vực [Ngành nghề của bạn].",
  "Tôi thích đọc sách và đi du lịch. Đọc sách giúp tôi thư giãn, còn du lịch mang lại cho tôi những trải nghiệm mới.",
  "Mỗi ngày, tôi bắt đầu làm việc lúc 8 giờ sáng. Tôi thường họp, xử lý email và hoàn thành các nhiệm vụ trong ngày.",
  "Kỳ nghỉ đáng nhớ nhất của tôi là chuyến đi đến Đà Nẵng. Tôi đã thăm Bà Nà Hills và thưởng thức các món ăn địa phương.",
  "Mục tiêu của tôi trong năm tới là học thêm một ngôn ngữ lập trình mới và tham gia nhiều dự án thú vị hơn.",
  "Gần đây, tôi đã học cách nấu ăn. Món ăn đầu tiên tôi nấu là món spaghetti và nó rất ngon.",
  "Cuốn sách yêu thích của tôi là 'Nhà giả kim' của Paulo Coelho. Nó mang đến nhiều bài học quý giá về cuộc sống.",
  "Thành tựu tôi tự hào nhất là tốt nghiệp đại học với điểm số cao. Đó là kết quả của sự nỗ lực không ngừng.",
  "Người tôi ngưỡng mộ nhất là cha tôi. Ông luôn làm việc chăm chỉ và không ngừng học hỏi.",
  "Cuối tuần này, tôi sẽ đi dã ngoại cùng gia đình. Chúng tôi dự định sẽ chơi thể thao và tổ chức một buổi picnic.",
  "Một thử thách lớn mà tôi đã vượt qua là học lái xe. Ban đầu rất khó khăn, nhưng cuối cùng tôi đã làm được.",
];

let constraintObj = {
  audio: true,
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
  document.getElementById("randomPrompt1").innerText = randomPromptElement;
  document.getElementById("randomPrompt2").innerText = randomPromptElement;

  document.getElementById("record").addEventListener("click", async () => {
    document.getElementById("prompt").style.visibility = "hidden";
    document.getElementById("capture").style.visibility = "visible";

    try {
      const duration = await calculateSpeechDuration(randomPromptElement);
      console.log(duration);
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
    }
  });

  document.getElementById("continueRecord").addEventListener("click", () => {
    document.getElementById("prompt").style.visibility = "visible";
    document.getElementById("capture").style.visibility = "hidden";

    randomPromptElement = getRandomPromt(prompts);
    document.getElementById("randomPrompt1").innerText = randomPromptElement;
    document.getElementById("randomPrompt2").innerText = randomPromptElement;
  });
});

function getRandomPromt(arr) {
  let randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

function calculateSpeechDuration(text) {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN"; // Ngôn ngữ tiếng Việt
    utterance.rate = 0.9; // Tốc độ đọc bình thường
    utterance.pitch = 1; // Cao độ bình thường
    utterance.volume = 0; // Âm lượng tối đa

    let startTime;

    navigator.mediaDevices
      .getUserMedia(constraintObj)
      .then(function (mediaStreamObj) {
        // ket noi media stream voi the video dau tien
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
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];

        // Sự kiện bắt đầu nói
        utterance.onstart = () => {
          mediaRecorder.start();
          startTime = performance.now();
          console.log("start!");
          console.log(mediaRecorder.state);
        };

        // Sự kiện kết thúc nói
        utterance.onend = () => {
          mediaRecorder.stop();
          const endTime = performance.now();
          const duration = endTime - startTime;
          resolve(duration);
          console.log("end!");
          console.log(mediaRecorder.state);

          // Dừng tất cả các track để ngừng tín hiệu đầu vào
          mediaStreamObj.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.ondataavailable = function (ev) {
          chunks.push(ev.data);
        };

        mediaRecorder.onstop = (ev) => {
          let blob = new Blob(chunks, { type: "video/mp4" });
          uploadVideo(blob);
        };

        // Bắt đầu nói
        window.speechSynthesis.speak(utterance);
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
