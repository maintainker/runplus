import {Svg, Path} from 'react-native-svg';
import {IconProps} from './svg';

const Comment = ({size = 24, color = '#000', style}: IconProps) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}>
      <Path
        d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
        fill={color}
      />
    </Svg>
  );
};

export default Comment;
