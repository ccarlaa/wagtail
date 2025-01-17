import React from 'react';
import { mount } from 'enzyme';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import nodes from '../../../PageExplorer/reducers/nodes';
import explorer from '../../../PageExplorer/reducers/explorer'; 
import { CommentHeader } from '.';

const rootReducer = combineReducers({
  explorer,
  nodes,
});

const store = createStore(rootReducer, {}, applyMiddleware(thunkMiddleware));

describe('CommentHeader', () => {
  it('exists', () => {
    expect(CommentHeader).toBeDefined();
  });

  it('renders without crashing', () => {
    const commentReply = {
      author: { name: 'John Doe', avatarUrl: 'https://example.com/avatar.jpg' },
      date: Date.now(),
    };
    const wrapper = mount(
      <Provider store={store}>
        <CommentHeader commentReply={commentReply} store={store} focused={false} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with actions if provided', () => {
    const commentReply = {
      author: { name: 'Jane Doe', avatarUrl: 'https://example.com/avatar.jpg' },
      date: Date.now(),
    };
    const wrapper = mount(
      <Provider store={store}>
        <CommentHeader
          commentReply={commentReply}
          store={store}
          focused={false}
          onResolve={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </Provider>
    );
    expect(wrapper.find('.comment-header__more-actions')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('calls onResolve when resolve button is clicked', () => {
    const onResolveMock = jest.fn();
    const commentReply = { author: { name: 'Jane Doe' }, date: Date.now() };

    const wrapper = mount(
      <Provider store={store}>
        <CommentHeader
          commentReply={commentReply}
          store={store}
          focused={false}
          onResolve={onResolveMock}
          onEdit={true}
        />
      </Provider>
    );

    wrapper.find('button').at(0).simulate('click');
    expect(onResolveMock).toHaveBeenCalledWith(commentReply, store);
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEditMock = jest.fn();
    const commentReply = { author: { name: 'Jane Doe' }, date: Date.now() };

    const wrapper = mount(
      <Provider store={store}>
        <CommentHeader
          commentReply={commentReply}
          store={store}
          focused={false}
          onEdit={onEditMock}
        />
      </Provider>
    );

    wrapper.find('button').at(1).simulate('click');
    expect(onEditMock).toHaveBeenCalledWith(commentReply, store);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteMock = jest.fn();
    const commentReply = { author: { name: 'Jane Doe' }, date: Date.now() };

    const wrapper = mount(
      <Provider store={store}>
        <CommentHeader
          commentReply={commentReply}
          store={store}
          focused={false}
          onDelete={onDeleteMock}
        />
      </Provider>
    );

    wrapper.find('button').at(2).simulate('click');
    expect(onDeleteMock).toHaveBeenCalledWith(commentReply, store);
  });

  it('closes menu when clicking outside', () => {
    const commentReply = { author: { name: 'John Doe' }, date: Date.now() };
    const wrapper = mount(
      <Provider store={store}>
        <CommentHeader commentReply={commentReply} store={store} focused={false} />
      </Provider>
    );

    wrapper.find('details').simulate('click');
    expect(wrapper.find('details').prop('open')).toBe(true);

    document.body.click();
    expect(wrapper.find('details').prop('open')).toBe(false);
  });
});
