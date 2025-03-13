import { ref, onMounted, nextTick } from "vue";
import { getVideoTree } from "@/api/curriculum";
import Player from "xgplayer";

export function useVideo() {
  const dataList = ref([]);
  const activeVideoIndex = ref<string | null>(null);
  const activeVideoUrl = ref<string | null>(null);
  const activeVideo = ref<any>(null);
  let player: Player | null = null;

  // 处理视频点击
  const handleVideoClick = (video: any) => {
    if (!video.url) return;

    activeVideoIndex.value = video.id;
    const videoUrl = video.url.startsWith('http') 
      ? video.url 
      : `https://${video.url}`;
    activeVideoUrl.value = videoUrl;
    activeVideo.value = video;

    if (player) {
      player.destroy();
    }

    nextTick(() => {
      const container = document.getElementById("mse");
      if (!container) {
        console.error("视频容器不存在");
        return;
      }

      player = new Player({
        id: "mse",
        url: videoUrl,
        lang: "zh",
        volume: 0.6,
        autoplay: false,
        screenShot: true,
        fluid: true,
        width: null,
        height: null,
        videoAttributes: {
          crossorigin: "anonymous",
          controls: true,
          preload: "metadata",
          playsinline: true,
          "webkit-playsinline": true,
          "x5-video-player-type": "h5",
          "x5-video-player-fullscreen": true
        },
        playbackRate: [0.5, 0.75, 1, 1.5, 2],
        pip: true,
        cssFullscreen: true,
        download: true,
        mediaType: "video/mp4",
        cors: true,
        isLive: false,
        ignores: [],
        whitelist: []
      });

      console.log("播放器URL:", videoUrl);
      
      player.on('error', (err) => {
        console.error("播放器错误:", err);
      });

      player.on('ready', () => {
        console.log("播放器就绪");
      });

      player.on('loading', () => {
        console.log("视频加载中");
      });

      player.on('loadeddata', () => {
        console.log("视频数据加载完成");
      });
    });
  };

  // 判断是否为视频节点
  const isVideoNode = (node: any) => {
    return !!node.url;
  };

  // 获取视频树数据
  const fetchVideoTree = async () => {
    try {
      const { data } = await getVideoTree();
      dataList.value = data;

      // 自动播放第一个视频
      if (data.length > 0) {
        // 递归查找第一个视频节点
        const findFirstVideo = (nodes: any[]): any => {
          for (const node of nodes) {
            if (isVideoNode(node)) {
              return node;
            }
            if (node.children?.length) {
              const found = findFirstVideo(node.children);
              if (found) return found;
            }
          }
          return null;
        };

        const firstVideo = findFirstVideo(data);
        if (firstVideo) {
          handleVideoClick(firstVideo);
        }
      }
    } catch (error) {
      console.error("获取视频树失败:", error);
    }
  };

  onMounted(() => {
    fetchVideoTree();
  });

  return {
    dataList,
    activeVideo,
    activeVideoIndex,
    handleVideoClick,
    isVideoNode
  };
}
