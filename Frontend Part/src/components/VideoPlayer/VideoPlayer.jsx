function VideoPlayer({ video }) {
  return (
    <div className="w-full max-w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        src={video?.videoFile?.url}
        controls
        className="w-full h-full max-w-full object-contain"
      />
    </div>
  );
}

export default VideoPlayer;