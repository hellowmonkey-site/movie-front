export default function VideoInfo() {
  return (
    <div class="video-info d-flex mar-b-5-item">
      <div class="video-cover mar-r-3-item">
        {video.value ? (
          <NImage src={video.value?.cover} objectFit="fill" class="full-width"></NImage>
        ) : (
          <NSkeleton height="300px"></NSkeleton>
        )}
      </div>
      <div class="flex-item-extend d-flex direction-column">
        <h1 class="font-xlg mar-b-5-item">{video.value ? video.value.title : <NSkeleton height="30px"></NSkeleton>}</h1>
        {video.value ? (
          <>
            {infoList.value.map(info => (
              <div class="mar-b-4-item d-flex">
                <span class="font-gray font-small mar-r-3">{info.text}</span>
                <span class="flex-item-extend">{info.value}</span>
              </div>
            ))}
            {video.value.description ? (
              <div class="mar-b-5-item d-flex">
                <span class="font-gray font-small mar-r-3">简介</span>
                <span class="flex-item-extend">
                  <Description text={video.value.description} />
                </span>
              </div>
            ) : null}
            <div class="d-flex align-items-center justify-center">
              <NButton
                size="large"
                type="primary"
                onClick={() => {
                  router.push({ name: "play", params: { videoId: video.value?.id, playId: video.value?.playlist[0].id } });
                }}
              >
                立即播放
              </NButton>
            </div>
          </>
        ) : (
          <>
            {new Array(5).fill(1).map((v, i) => (
              <NSkeleton height="20px" text class="mar-b-3-item"></NSkeleton>
            ))}
            <NSkeleton height="100px" text></NSkeleton>
          </>
        )}
      </div>
    </div>
  );
}
