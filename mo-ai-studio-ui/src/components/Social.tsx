import type { IconSvgProps } from "../types"

import React from "react"

const OpenCollectiveIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg
      fill='none'
      height={size || height}
      viewBox='0 0 24 24'
      width={size || width}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipPath='url(#a)' clipRule='evenodd' fill='currentColor' fillRule='evenodd'>
        <path d='M21.865 5.166A11.945 11.945 0 0 1 24 12.001c0 2.54-.789 4.895-2.135 6.834l-3.109-3.109A7.679 7.679 0 0 0 19.714 12a7.679 7.679 0 0 0-.958-3.725l3.109-3.109Z' />
        <path d='m18.834 2.135-3.108 3.109a7.714 7.714 0 1 0 0 13.513l3.108 3.108A11.946 11.946 0 0 1 12 24C5.373 24 0 18.627 0 12S5.373 0 12 0c2.54 0 4.895.789 6.834 2.135Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path d='M0 0h24v24H0z' fill='#fff' />
        </clipPath>
      </defs>
    </svg>
  )
}

const PatreonIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg
      fill='none'
      height={size || height}
      viewBox='0 0 24 24'
      width={size || width}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipPath='url(#a)' fill='currentColor'>
        <path d='M15.294 17.986c4.766 0 8.63-4.026 8.63-8.993C23.923 4.026 20.06 0 15.293 0c-4.766 0-8.63 4.026-8.63 8.993 0 4.967 3.864 8.993 8.63 8.993ZM4.218 0H0v23.991h4.218V0Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path d='M0 0h24v24H0z' fill='#fff' />
        </clipPath>
      </defs>
    </svg>
  )
}

const DiscordIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg height={size || height} viewBox='0 0 24 24' width={size || width} {...props}>
      <path
        d='M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z'
        fill='currentColor'
      />
    </svg>
  )
}

const TwitterIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg height={size || height} viewBox='0 0 24 24' width={size || width} {...props}>
      <path
        d='M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z'
        fill='currentColor'
      />
    </svg>
  )
}

const GithubIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg height={size || height} viewBox='0 0 24 24' width={size || width} {...props}>
      <path
        clipRule='evenodd'
        d='M22.39 6.27a11.947 11.947 0 0 0-4.367-4.367C16.184.83 14.177.293 12 .293c-2.177 0-4.185.537-6.023 1.61A11.946 11.946 0 0 0 1.609 6.27C.536 8.11 0 10.116 0 12.293c0 2.615.763 4.966 2.289 7.055 1.526 2.088 3.497 3.533 5.914 4.335.281.053.49.016.625-.109a.611.611 0 0 0 .203-.468l-.008-.844c-.005-.464-.008-.927-.008-1.39l-.36.062a4.49 4.49 0 0 1-.866.054 6.607 6.607 0 0 1-1.086-.109 2.427 2.427 0 0 1-1.047-.468 1.982 1.982 0 0 1-.688-.961l-.156-.36a3.904 3.904 0 0 0-.492-.796c-.224-.292-.45-.49-.68-.594l-.109-.078a1.146 1.146 0 0 1-.203-.188.859.859 0 0 1-.14-.219c-.032-.073-.006-.133.077-.18.084-.047.235-.07.454-.07l.312.047c.208.042.466.166.773.375.308.208.56.479.758.812.24.427.529.753.867.977.339.224.68.336 1.024.336.343 0 .64-.026.89-.078.25-.052.485-.13.703-.235.094-.698.35-1.234.766-1.61a10.705 10.705 0 0 1-1.602-.28 6.377 6.377 0 0 1-1.468-.61 4.208 4.208 0 0 1-1.258-1.047c-.333-.416-.607-.964-.82-1.64-.214-.678-.32-1.459-.32-2.344 0-1.26.411-2.334 1.234-3.219-.386-.948-.35-2.01.11-3.187.301-.094.75-.024 1.343.21.594.235 1.028.436 1.305.602.276.167.497.308.664.422.969-.27 1.969-.406 3-.406 1.03 0 2.031.135 3 .406l.594-.375c.406-.25.885-.479 1.437-.687.552-.209.974-.266 1.266-.172.468 1.177.51 2.24.125 3.187.822.886 1.234 1.959 1.234 3.219 0 .885-.107 1.669-.32 2.351-.214.683-.49 1.23-.828 1.641-.339.412-.76.758-1.266 1.039a6.388 6.388 0 0 1-1.469.61c-.474.124-1.007.219-1.601.281.541.469.812 1.208.812 2.219v3.296c0 .187.065.344.196.469.13.124.335.161.617.109 2.417-.802 4.388-2.247 5.914-4.336C23.237 17.26 24 14.907 24 12.293c0-2.177-.538-4.184-1.61-6.023Z'
        fill='currentColor'
        fillRule='evenodd'
      />
    </svg>
  )
}

const NextJsIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg aria-hidden='true' height={size || height} viewBox='0 0 256 256' width={size || width} {...props}>
      <path
        d='M119.617.069c-.55.05-2.302.225-3.879.35-36.36 3.278-70.419 22.894-91.99 53.044-12.012 16.764-19.694 35.78-22.597 55.922C.125 116.415 0 118.492 0 128.025c0 9.533.125 11.61 1.151 18.64 6.957 48.065 41.165 88.449 87.56 103.411 8.309 2.678 17.067 4.504 27.027 5.605 3.879.425 20.645.425 24.524 0 17.192-1.902 31.756-6.155 46.12-13.486 2.202-1.126 2.628-1.426 2.327-1.677-.2-.15-9.584-12.735-20.845-27.948l-20.47-27.648-25.65-37.956c-14.114-20.868-25.725-37.932-25.825-37.932-.1-.025-.2 16.84-.25 37.431-.076 36.055-.1 37.506-.551 38.357-.65 1.226-1.151 1.727-2.202 2.277-.801.4-1.502.475-5.28.475h-4.33l-1.15-.725a4.679 4.679 0 0 1-1.677-1.827l-.526-1.126.05-50.166.075-50.192.776-.976c.4-.525 1.251-1.2 1.852-1.526 1.026-.5 1.426-.55 5.755-.55 5.105 0 5.956.2 7.282 1.651.376.4 14.264 21.318 30.88 46.514 16.617 25.195 39.34 59.599 50.5 76.488l20.27 30.7 1.026-.675c9.084-5.905 18.693-14.312 26.3-23.07 16.191-18.59 26.626-41.258 30.13-65.428 1.026-7.031 1.151-9.108 1.151-18.64 0-9.534-.125-11.61-1.151-18.641-6.957-48.065-41.165-88.449-87.56-103.411-8.184-2.652-16.892-4.479-26.652-5.58-2.402-.25-18.943-.525-21.02-.325zm52.401 77.414c1.201.6 2.177 1.752 2.527 2.953.2.65.25 14.562.2 45.913l-.074 44.987-7.933-12.16-7.958-12.16v-32.702c0-21.143.1-33.028.25-33.603.4-1.401 1.277-2.502 2.478-3.153 1.026-.525 1.401-.575 5.33-.575 3.704 0 4.354.05 5.18.5z'
        fill='currentColor'
      />
    </svg>
  )
}
const VercelIcon: React.FC<IconSvgProps> = ({ width, height = 44, ...props }) => {
  return (
    <svg
      fill='none'
      height={height}
      viewBox='0 0 4438 1000'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M2223.75 250C2051.25 250 1926.87 362.5 1926.87 531.25C1926.87 700 2066.72 812.5 2239.38 812.5C2343.59 812.5 2435.47 771.25 2492.34 701.719L2372.81 632.656C2341.25 667.188 2293.28 687.344 2239.38 687.344C2164.53 687.344 2100.94 648.281 2077.34 585.781H2515.16C2518.59 568.281 2520.63 550.156 2520.63 531.094C2520.63 362.5 2396.41 250 2223.75 250ZM2076.09 476.562C2095.62 414.219 2149.06 375 2223.75 375C2298.59 375 2352.03 414.219 2371.41 476.562H2076.09ZM2040.78 78.125L1607.81 828.125L1174.69 78.125H1337.03L1607.66 546.875L1878.28 78.125H2040.78ZM577.344 0L1154.69 1000H0L577.344 0ZM3148.75 531.25C3148.75 625 3210 687.5 3305 687.5C3369.38 687.5 3417.66 658.281 3442.5 610.625L3562.5 679.844C3512.81 762.656 3419.69 812.5 3305 812.5C3132.34 812.5 3008.13 700 3008.13 531.25C3008.13 362.5 3132.5 250 3305 250C3419.69 250 3512.66 299.844 3562.5 382.656L3442.5 451.875C3417.66 404.219 3369.38 375 3305 375C3210.16 375 3148.75 437.5 3148.75 531.25ZM4437.5 78.125V796.875H4296.88V78.125H4437.5ZM3906.25 250C3733.75 250 3609.38 362.5 3609.38 531.25C3609.38 700 3749.38 812.5 3921.88 812.5C4026.09 812.5 4117.97 771.25 4174.84 701.719L4055.31 632.656C4023.75 667.188 3975.78 687.344 3921.88 687.344C3847.03 687.344 3783.44 648.281 3759.84 585.781H4197.66C4201.09 568.281 4203.12 550.156 4203.12 531.094C4203.12 362.5 4078.91 250 3906.25 250ZM3758.59 476.562C3778.13 414.219 3831.41 375 3906.25 375C3981.09 375 4034.53 414.219 4053.91 476.562H3758.59ZM2961.25 265.625V417.031C2945.63 412.5 2929.06 409.375 2911.25 409.375C2820.47 409.375 2755 471.875 2755 565.625V796.875H2614.38V265.625H2755V409.375C2755 330 2847.34 265.625 2961.25 265.625Z'
        fill='currentColor'
      />
    </svg>
  )
}

const NpmIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg
      aria-hidden='true'
      fill='currentColor'
      focusable='false'
      height={height}
      stroke='currentColor'
      strokeWidth='0'
      viewBox='0 0 576 512'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z' />
    </svg>
  )
}

const NpmSmallIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg
      fill='currentColor'
      focusable='false'
      height={height}
      stroke='currentColor'
      strokeWidth='0'
      viewBox='0 0 16 16'
      width={width}
      {...props}
    >
      <path d='M0 0v16h16v-16h-16zM13 13h-2v-8h-3v8h-5v-10h10v10z' />
    </svg>
  )
}

// #E1251B
export const AdobeIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg
      aria-hidden='true'
      aria-label='Adobe'
      fill='currentColor'
      focusable='false'
      height={height}
      viewBox='0 0 30 26'
      width={width}
      {...props}
    >
      <polygon points='19,0 30,0 30,26' />
      <polygon points='11.1,0 0,0 0,26' />
      <polygon points='15,9.6 22.1,26 17.5,26 15.4,20.8 10.2,20.8' />
    </svg>
  )
}

const YarnIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg
      aria-hidden='true'
      fill='currentColor'
      focusable='false'
      height={height}
      stroke='currentColor'
      strokeWidth='0'
      viewBox='0 0 496 512'
      width={width}
      {...props}
    >
      <path d='M393.9 345.2c-39 9.3-48.4 32.1-104 47.4 0 0-2.7 4-10.4 5.8-13.4 3.3-63.9 6-68.5 6.1-12.4.1-19.9-3.2-22-8.2-6.4-15.3 9.2-22 9.2-22-8.1-5-9-9.9-9.8-8.1-2.4 5.8-3.6 20.1-10.1 26.5-8.8 8.9-25.5 5.9-35.3.8-10.8-5.7.8-19.2.8-19.2s-5.8 3.4-10.5-3.6c-6-9.3-17.1-37.3 11.5-62-1.3-10.1-4.6-53.7 40.6-85.6 0 0-20.6-22.8-12.9-43.3 5-13.4 7-13.3 8.6-13.9 5.7-2.2 11.3-4.6 15.4-9.1 20.6-22.2 46.8-18 46.8-18s12.4-37.8 23.9-30.4c3.5 2.3 16.3 30.6 16.3 30.6s13.6-7.9 15.1-5c8.2 16 9.2 46.5 5.6 65.1-6.1 30.6-21.4 47.1-27.6 57.5-1.4 2.4 16.5 10 27.8 41.3 10.4 28.6 1.1 52.7 2.8 55.3.8 1.4 13.7.8 36.4-13.2 12.8-7.9 28.1-16.9 45.4-17 16.7-.5 17.6 19.2 4.9 22.2zM496 256c0 136.9-111.1 248-248 248S0 392.9 0 256 111.1 8 248 8s248 111.1 248 248zm-79.3 75.2c-1.7-13.6-13.2-23-28-22.8-22 .3-40.5 11.7-52.8 19.2-4.8 3-8.9 5.2-12.4 6.8 3.1-44.5-22.5-73.1-28.7-79.4 7.8-11.3 18.4-27.8 23.4-53.2 4.3-21.7 3-55.5-6.9-74.5-1.6-3.1-7.4-11.2-21-7.4-9.7-20-13-22.1-15.6-23.8-1.1-.7-23.6-16.4-41.4 28-12.2.9-31.3 5.3-47.5 22.8-2 2.2-5.9 3.8-10.1 5.4h.1c-8.4 3-12.3 9.9-16.9 22.3-6.5 17.4.2 34.6 6.8 45.7-17.8 15.9-37 39.8-35.7 82.5-34 36-11.8 73-5.6 79.6-1.6 11.1 3.7 19.4 12 23.8 12.6 6.7 30.3 9.6 43.9 2.8 4.9 5.2 13.8 10.1 30 10.1 6.8 0 58-2.9 72.6-6.5 6.8-1.6 11.5-4.5 14.6-7.1 9.8-3.1 36.8-12.3 62.2-28.7 18-11.7 24.2-14.2 37.6-17.4 12.9-3.2 21-15.1 19.4-28.2z' />
    </svg>
  )
}

const PnpmIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg
      aria-hidden='true'
      fill='currentColor'
      focusable='false'
      height={height}
      role='img'
      stroke='currentColor'
      strokeWidth='0'
      viewBox='0 0 24 24'
      width={width}
      {...props}
    >
      <title />
      <path d='M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z' />
    </svg>
  )
}

const AstroIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg aria-hidden='true' fill='none' focusable='false' height={height} width={width} {...props}>
      <path
        clipRule='evenodd'
        d='M16.986 23.22c-3.498 0-6.986 1.694-6.986 1.694s5.924-16.1 5.937-16.131c.181-.476.457-.783.844-.783h7.11c.386 0 .673.307.843.783l5.936 16.131s-2.843-1.695-6.985-1.695l-2.637-8.14c-.1-.395-.387-.662-.713-.662-.325 0-.614.268-.712.661l-2.637 8.141zm-.572 6.477h.001-.001zM15.3 24.378c-.532 1.751-.16 4.168 1.115 5.319l.017-.061a1.42 1.42 0 00.03-.116c.16-.73.762-1.195 1.524-1.173.741.021 1.135.392 1.25 1.22.042.307.046.62.05.933l.001.098c.01.707.195 1.361.585 1.952a3.4 3.4 0 001.515 1.279l-.018-.06a4.332 4.332 0 00-.03-.1c-.488-1.476-.137-2.49 1.16-3.356l.398-.261c.293-.19.585-.38.867-.586 1.022-.747 1.665-1.732 1.817-3.007a3.404 3.404 0 00-.162-1.547c-.076.045-.148.09-.218.134-.15.094-.29.182-.437.253-1.897.921-3.902 1.035-5.944.73-1.322-.197-2.599-.547-3.52-1.651z'
        fill='currentColor'
        fillRule='evenodd'
      />
    </svg>
  )
}

const NewNextJSIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg aria-hidden='true' fill='none' focusable='false' height={height} width={width} {...props}>
      <mask
        height='26'
        id='nextjs-white_svg__a'
        maskUnits='userSpaceOnUse'
        style={{
          maskType: "alpha",
        }}
        width='26'
        x='7'
        y='7'
      >
        <path d='M20 33c7.18 0 13-5.82 13-13S27.18 7 20 7 7 12.82 7 20s5.82 13 13 13z' fill='#000' />
      </mask>
      <g mask='url(#nextjs-white_svg__a)'>
        <path
          d='M20 32.567c6.94 0 12.567-5.627 12.567-12.567S26.94 7.433 20 7.433 7.433 13.06 7.433 20 13.06 32.567 20 32.567z'
          fill='#000'
          stroke='#fff'
          strokeWidth='0.867'
        />
        <path
          d='M28.596 29.753L16.987 14.8H14.8v10.396h1.75v-8.174l10.672 13.789c.482-.322.94-.676 1.374-1.058z'
          fill='url(#nextjs-white_svg__b)'
        />
        <path d='M25.344 14.8h-1.733v10.4h1.733V14.8z' fill='url(#nextjs-white_svg__c)' />
      </g>
      <defs>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='nextjs-white_svg__b'
          x1='22.744'
          x2='27.872'
          y1='23.828'
          y2='30.183'
        >
          <stop stopColor='#fff' />
          <stop offset='1' stopColor='#fff' stopOpacity='0' />
        </linearGradient>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='nextjs-white_svg__c'
          x1='24.478'
          x2='24.449'
          y1='14.8'
          y2='22.438'
        >
          <stop stopColor='#fff' />
          <stop offset='1' stopColor='#fff' stopOpacity='0' />
        </linearGradient>
      </defs>
    </svg>
  )
}

const RemixIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg aria-hidden='true' fill='none' focusable='false' height={height} viewBox='0 0 40 40' width={width} {...props}>
      <path
        d='M29.397 26.388c.213 2.733.213 4.014.213 5.412h-6.322c0-.305.005-.583.01-.866.018-.878.036-1.794-.107-3.643-.188-2.708-1.354-3.31-3.497-3.31H9.75v-4.926h10.244c2.708 0 4.063-.823 4.063-3.005 0-1.917-1.355-3.08-4.063-3.08H9.75V8.15h11.373c6.13 0 9.177 2.896 9.177 7.521 0 3.46-2.144 5.716-5.04 6.092 2.445.489 3.874 1.88 4.137 4.625z'
        fill='currentColor'
      />
      <path d='M9.75 31.8v-3.672h6.685c1.116 0 1.359.828 1.359 1.322v2.35H9.75z' fill='currentColor' />
    </svg>
  )
}

const ViteIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg aria-hidden='true' fill='none' focusable='false' height={height} viewBox='0 0 40 40' width={width} {...props}>
      <path
        d='M31.881 11.61L20.886 31.563a.593.593 0 01-1.04.004L8.633 11.611c-.251-.446.125-.987.624-.897l11.007 1.997a.59.59 0 00.212 0l10.777-1.994c.497-.092.875.445.628.893z'
        fill='url(#vite_svg__paint0_linear_41_6732)'
      />
      <path
        d='M25.506 8.096l-8.137 1.618a.302.302 0 00-.241.28l-.5 8.578a.3.3 0 00.365.314l2.265-.531c.212-.05.404.14.36.356l-.673 3.345a.3.3 0 00.38.35l1.399-.43a.3.3 0 01.38.35l-1.07 5.255c-.067.328.364.507.543.226l.12-.189 6.63-13.428c.111-.225-.08-.481-.323-.433l-2.332.456a.301.301 0 01-.344-.381l1.522-5.355a.301.301 0 00-.345-.381z'
        fill='url(#vite_svg__paint1_linear_41_6732)'
      />
      <defs>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='vite_svg__paint0_linear_41_6732'
          x1='8.359'
          x2='22.306'
          y1='10.001'
          y2='28.665'
        >
          <stop stopColor='#41D1FF' />
          <stop offset='1' stopColor='#BD34FE' />
        </linearGradient>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='vite_svg__paint1_linear_41_6732'
          x1='19.631'
          x2='22.178'
          y1='8.535'
          y2='25.757'
        >
          <stop stopColor='#FFEA83' />
          <stop offset='0.083' stopColor='#FFDD35' />
          <stop offset='1' stopColor='#FFA800' />
        </linearGradient>
      </defs>
    </svg>
  )
}

const StorybookIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg
      aria-hidden='true'
      fill='none'
      focusable='false'
      height={height}
      viewBox='0 0 512 512'
      width={width}
      {...props}
    >
      <g>
        <path
          d='M356.5,5.2L353.9,63c-0.1,3.2,3.7,5.2,6.3,3.2l22.6-17.1L401.9,64c2.5,1.7,5.8,0,6-3l-2.2-58.8l28.4-2.2   c14.7-1,27.3,10.8,27.3,25.6v460.8c0,14.7-12.3,26.3-26.9,25.6L91.1,496.6c-13.3-0.6-24.1-11.3-24.5-24.7l-16-422.3   c-0.8-14.2,9.9-26.3,24.1-27.1L356.2,4.7L356.5,5.2z M291,198.4c0,10,67.4,5.1,76.6-1.7c0-68.2-36.7-104.3-103.6-104.3   c-67.2,0-104.5,36.8-104.5,91.6c0,94.9,128,96.6,128,148.4c0,15-6.8,23.5-22.4,23.5c-20.5,0-28.8-10.4-27.7-46.1   c0-7.7-77.8-10.3-80.4,0c-5.7,86,47.6,110.9,108.7,110.9c59.6,0,106.1-31.7,106.1-89.1c0-101.7-130.1-99-130.1-149.3   c0-20.7,15.4-23.4,24.1-23.4c9.7,0,26.7,1.5,25.4,39.8L291,198.4z'
          fill='currentColor'
        />
      </g>
    </svg>
  )
}

const CodeSandboxIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg fill='none' height={height} viewBox='0 0 18 18' width={width} xmlns='http://www.w3.org/2000/svg' {...props}>
      <path d='M3.24284 5.11427L8.63639 2.17808C8.92945 2.01854 9.28432 2.02264 9.57361 2.18889L14.7726 5.17673C15.011 5.3137 15.1579 5.56762 15.1579 5.84251V12.1884C15.1579 12.4639 15.0103 12.7183 14.7711 12.8551L9.38463 15.9346C9.1466 16.0707 8.85406 16.0696 8.61711 15.9316L3.22361 12.7912C2.9874 12.6537 2.8421 12.4009 2.8421 12.1276V5.7887C2.8421 5.50747 2.99584 5.24873 3.24284 5.11427Z' />
      <path
        clipRule='evenodd'
        d='M8.99649 9.06298V15.1165C9.10189 15.1165 9.17115 15.0936 9.26577 15.0396L14.113 12.2698C14.3044 12.1601 14.3824 11.9902 14.3824 11.7696V6.15302C14.3824 6.04235 14.3591 5.97615 14.3053 5.88373L9.15154 8.79576C9.05567 8.85054 8.99649 8.95253 8.99649 9.06298ZM11.6894 12.539C11.6894 12.6929 11.6317 12.7698 11.497 12.8468L9.88129 13.7701C9.76591 13.847 9.61201 13.8086 9.61201 13.6546V9.53835C9.61201 9.42824 9.7089 9.28555 9.80434 9.2306L13.4975 7.11477C13.6001 7.05573 13.6898 7.15029 13.6898 7.26865V9.46146C13.6898 9.5751 13.6362 9.67725 13.5359 9.73074L11.8817 10.6155C11.7814 10.669 11.6894 10.7711 11.6894 10.8848V12.539Z'
        fill='currentColor'
        fillRule='evenodd'
      />
      <path
        clipRule='evenodd'
        d='M3.61069 11.7696V6.15297C3.61069 5.93209 3.72667 5.72398 3.91845 5.61439L8.61177 2.95996C8.71289 2.90638 8.88105 2.88303 8.99648 2.88303C9.11191 2.88303 9.28993 2.91161 9.38119 2.95997L14.036 5.61439C14.1281 5.66881 14.2533 5.79415 14.3053 5.88368L9.15033 8.8074C9.05447 8.86219 8.99648 8.96624 8.99648 9.07668V15.1165C8.89108 15.1165 8.78334 15.0936 8.68872 15.0395L3.95692 12.3082C3.76514 12.1985 3.61069 11.9904 3.61069 11.7696ZM4.30315 7.26859V9.46139C4.30315 9.61524 4.34162 9.6922 4.4955 9.76915L6.11123 10.6924C6.26511 10.7694 6.30358 10.8848 6.30358 11.0002V12.539C6.30358 12.6928 6.34205 12.7698 6.49593 12.8467L8.11167 13.77C8.26553 13.847 8.38096 13.8085 8.38096 13.6546V9.53835C8.38096 9.42292 8.34249 9.30749 8.18863 9.23059L4.57243 7.15319C4.45703 7.07625 4.30315 7.11472 4.30315 7.26859ZM10.6122 4.65264L9.18881 5.46051C9.07343 5.53745 8.91953 5.53745 8.80415 5.46051L7.38074 4.65264C7.28705 4.59968 7.16683 4.59995 7.07298 4.65264L5.30337 5.65286C5.14949 5.7298 5.14949 5.88368 5.30337 5.96062L8.84257 7.99953C8.9373 8.05375 9.05566 8.05375 9.15033 7.99953L12.6896 5.96062C12.805 5.88368 12.8435 5.7298 12.6896 5.65286L10.92 4.65264C10.8261 4.59995 10.7059 4.59968 10.6122 4.65264Z'
        fill='currentColor'
        fillRule='evenodd'
      />
    </svg>
  )
}

const JavascriptIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg
      fill='currentColor'
      height={height}
      viewBox='0 0 24 24'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z' />
    </svg>
  )
}

const TypescriptIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg
      fill='currentColor'
      height={height}
      viewBox='0 0 24 24'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z' />
    </svg>
  )
}

const GoogleIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg focusable='false' height={size || height} viewBox='0 0 24 24' width={size || width} {...props}>
      <g transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'>
        <path
          d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z'
          fill='#4285F4'
        />
        <path
          d='M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z'
          fill='#34A853'
        />
        <path
          d='M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z'
          fill='#FBBC05'
        />
        <path
          d='M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z'
          fill='#EA4335'
        />
      </g>
    </svg>
  )
}

const FacebookIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg fill='currentColor' height={height} viewBox='0 0 24 24' width={width} {...props}>
      <path d='M0 0h24v24H0z' fill='none' />
      <path
        d='M21 3H3C1.9 3 1 3.9 1 5v18c0 1.1.9 2 2 2h9v-9h-3v-3h3v-2c0-2.76 2.24-5 5-5h3v3h-3c-.55 0-1 .45-1 1v2h4l-1 3h-3v9h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'
        fill='currentColor'
      />
    </svg>
  )
}

const AppleIcon: React.FC<IconSvgProps> = ({ width = "1em", height = "1em", ...props }) => {
  return (
    <svg fill='currentColor' height={height} viewBox='0 0 24 24' width={width} {...props}>
      <path
        d='M20.5 12.9c-.1-3.9 3-5.9 3-5.9c-1.6-2.2-4-2.5-4.9-2.6c-2.1-.2-4.1 1.2-5.1 1.2c-1 0-2.6-1.2-4.3-1.1c-1.7.1-3.3 1.1-4.3 2.7c-1.9 2.8-1.6 7.1-.8 9.5c1 2.9 2.9 5.1 5.1 6.5c1.3.8 2.7 1.4 4.1 1.5c1.4.1 2.8-.4 4.1-1.1c1.3-.7 2.5-1.7 3.4-3c1.1-1.5 1.8-3.3 1.9-5.2c0-.4.1-1.5-.1-2.9c-.1-1.2-.4-2.3-.8-3.2z'
        fill='currentColor'
      />
    </svg>
  )
}

const AcmeIcon: React.FC<IconSvgProps> = ({ size = 32, width, height, ...props }) => (
  <svg fill='none' height={size || height} viewBox='0 0 32 32' width={size || width} {...props}>
    <path
      clipRule='evenodd'
      d='M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z'
      fill='currentColor'
      fillRule='evenodd'
    />
  </svg>
)

export {
  GoogleIcon,
  FacebookIcon,
  AppleIcon,
  TwitterIcon,
  DiscordIcon,
  GithubIcon,
  OpenCollectiveIcon,
  PatreonIcon,
  NextJsIcon,
  VercelIcon,
  NpmIcon,
  NpmSmallIcon,
  PnpmIcon,
  YarnIcon,
  AstroIcon,
  RemixIcon,
  ViteIcon,
  NewNextJSIcon,
  StorybookIcon,
  CodeSandboxIcon,
  JavascriptIcon,
  TypescriptIcon,
  AcmeIcon,
}