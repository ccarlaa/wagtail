import { render, screen, fireEvent } from '@testing-library/react';
import { CommentHeader } from './index';
import { Author } from '../../state/comments';

const mockStore = {};

describe('CommentHeader', () => {
  const commentReply = {
    author: { name: 'John Doe', avatarUrl: 'https://example.com/avatar.jpg' } as Author,
    date: new Date('2025-01-17T12:00:00Z').getTime(),
  };

  it('should display the comment author and date when author is provided', () => {
    render(<CommentHeader commentReply={commentReply} store={mockStore} focused={false} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jan 17, 2025, 12:00 PM')).toBeInTheDocument();
  });

  it('should not display the author or avatar when author is not provided', () => {
    const commentReplyWithoutAuthor = { author: null, date: commentReply.date };
    render(<CommentHeader commentReply={commentReplyWithoutAuthor} store={mockStore} focused={false} />);
    expect(screen.queryByText('John Doe')).toBeNull();
    const avatar = screen.queryByAltText('');
    expect(avatar).toBeNull();
  });

  it('should show the menu when actions are passed (edit, delete, resolve)', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onResolve = jest.fn();
    render(
      <CommentHeader
        commentReply={commentReply}
        store={mockStore}
        onEdit={onEdit}
        onDelete={onDelete}
        onResolve={onResolve}
        focused={false}
      />
    );
    const moreActionsButton = screen.getByLabelText('More actions');
    fireEvent.click(moreActionsButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Resolve')).toBeInTheDocument();
  });

  it('should call onEdit when the edit button is clicked', () => {
    const onEdit = jest.fn();
    render(
      <CommentHeader
        commentReply={commentReply}
        store={mockStore}
        onEdit={onEdit}
        focused={false}
      />
    );
    const moreActionsButton = screen.getByLabelText('More actions');
    fireEvent.click(moreActionsButton);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(commentReply, mockStore);
  });

  it('should call onDelete when the delete button is clicked', () => {
    const onDelete = jest.fn();
    render(
      <CommentHeader
        commentReply={commentReply}
        store={mockStore}
        onDelete={onDelete}
        focused={false}
      />
    );
    const moreActionsButton = screen.getByLabelText('More actions');
    fireEvent.click(moreActionsButton);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(commentReply, mockStore);
  });

  it('should call onResolve when the resolve button is clicked', () => {
    const onResolve = jest.fn();
    render(
      <CommentHeader
        commentReply={commentReply}
        store={mockStore}
        onResolve={onResolve}
        focused={false}
      />
    );
    const moreActionsButton = screen.getByLabelText('More actions');
    fireEvent.click(moreActionsButton);
    const resolveButton = screen.getByText('Resolve');
    fireEvent.click(resolveButton);
    expect(onResolve).toHaveBeenCalledWith(commentReply, mockStore);
  });

  it('should toggle menu when more actions button is clicked', () => {
    render(
      <CommentHeader
        commentReply={commentReply}
        store={mockStore}
        focused={false}
      />
    );
    const moreActionsButton = screen.getByLabelText('More actions');
    fireEvent.click(moreActionsButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    fireEvent.click(moreActionsButton);
    expect(screen.queryByText('Edit')).toBeNull();
  });

  it('should close menu when clicking outside of the menu', () => {
    render(
      <CommentHeader
        commentReply={commentReply}
        store={mockStore}
        focused={false}
      />
    );
    const moreActionsButton = screen.getByLabelText('More actions');
    fireEvent.click(moreActionsButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    fireEvent.click(document);
    expect(screen.queryByText('Edit')).toBeNull();
  });

  it('should close menu when focused is false', () => {
    render(
      <CommentHeader
        commentReply={commentReply}
        store={mockStore}
        focused={true}
      />
    );
    const moreActionsButton = screen.getByLabelText('More actions');
    fireEvent.click(moreActionsButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    render(
      <CommentHeader
        commentReply={commentReply}
        store={mockStore}
        focused={false}
      />
    );
    expect(screen.queryByText('Edit')).toBeNull();
  });
});
