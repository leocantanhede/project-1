import { Component } from 'react';

import './styles.css';

import { loadPosts } from '../../services/load-posts';
import { Posts } from '../../components/Posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export default class Home extends Component {

  state = {
      posts: [],
      allPosts: [],
      page: 0,
      postsPerPage: 10,
      searchValue: ''
  };

  async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state;
    const postsAndPhotos = await loadPosts();
    this.setState({ ...this.state, posts: postsAndPhotos.slice(page, postsPerPage), allPosts: postsAndPhotos });
  }

  loadMorePosts = () => {
    const { page, postsPerPage, allPosts, posts } = this.state;
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);
    this.setState({ ...this.state, posts, page: nextPage });
  }

  handleChange = (event) => {
    const { value } = event.currentTarget;
    this.setState( { ...this.state, searchValue: value });
  }

  render() {
      const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
      const noMorePosts = page + postsPerPage >= allPosts.length;
      const filteredPosts = !!searchValue ? 
        allPosts.filter(post => { return post.title.toLowerCase().includes(searchValue.toLowerCase()) }) : 
        posts;
      return (
        <section className="container">
          <div className="search-container">
            {!!searchValue && (<h1>Search value: {searchValue}</h1>)}
            <TextInput searchValue={searchValue} handleChange={this.handleChange} />
          </div>
          {filteredPosts.length > 0 && (<Posts posts={filteredPosts} />)}
          {filteredPosts.length === 0 && (<p>There are not posts</p>)}
          <div className="button-container">
            {!searchValue && (<Button disabled={noMorePosts} text="Load more posts" onClick={this.loadMorePosts} />)}
          </div>
        </section>
      );
  }

}