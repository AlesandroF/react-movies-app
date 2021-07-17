import React from 'react';

import {
  HeaderText,
  Header,
  HeaderContent
} from './styles';

export default function HeaderApp() {
  return (
    <Header>
      <HeaderContent>
        <HeaderText>
          Movies App
        </HeaderText>
      </HeaderContent>
    </Header>
  );
}