import {Svg, Path} from 'react-native-svg';
import {IconProps} from './svg';

const EmailIcon = ({size = 24, color = '#666666'}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
      fill={color}
    />
  </Svg>
);
export default EmailIcon;
