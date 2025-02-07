const Avatar = ({ username }) => {
  const getInitials = (name) => {
    const parts = name.split("");
    const initials = parts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    return initials.length > 2 ? initials.slice(0, 2) : initials;
  };

  const generateRandomColor = () => {
    const colors = ["#555555"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      className="w-40 h-40 flex items-center justify-center font-bold text-uppercase text-white rounded-full"
      style={{
        backgroundColor: generateRandomColor(),
      }}
    >
      {getInitials(username)}
    </div>
  );
};

export default Avatar;
