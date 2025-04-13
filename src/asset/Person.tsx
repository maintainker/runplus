import {Path, Svg} from 'react-native-svg';
import {IconProps} from './svg';

const Person = ({size = 24, color = '#000', style}: IconProps) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      style={style}>
      <Path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill={color}
      />
    </Svg>
  );
};

export default Person;
