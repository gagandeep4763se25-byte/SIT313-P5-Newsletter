import { useState } from 'react';
import './Post.css';

function Post() {
    const [postType, setPostType] = useState('article');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [abstract, setAbstract] = useState('');
    const [articleText, setArticleText] = useState('');
    const [tags, setTags] = useState('');


    function handleSubmit(event) {
        event.preventDefault();

        if (title.trim().length < 5) {
            window.alert('Please enter a title containing at least 5 characters.');
            return;
        }

        if (postType === 'question' && description.trim().length < 20) {
            window.alert('Please describe your question using at least 20 characters.');
            return;
        }

        if (postType === 'article') {
            if (abstract.trim().length < 20) {
                window.alert('Please enter an abstract containing at least 20 characters.');
                return;
            }

            if (articleText.trim().length < 50) {
                window.alert('Please enter article text containing at least 50 characters.');
                return;
            }
        }

        const enteredTags = tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        if (enteredTags.length > 3) {
            window.alert('Please enter no more than 3 tags.');
            return;
        }

        if (enteredTags.some((tag) => tag.length < 2 || tag.length > 30)) {
            window.alert('Each tag must contain between 2 and 30 characters.');
            return;
        }

        const uniqueTags = enteredTags.map((tag) => tag.toLowerCase());

        if (uniqueTags.length !== new Set(uniqueTags).size) {
            window.alert('Please remove duplicate tags.');
            return;
        }

        window.alert(
            `Your ${postType === 'question' ? 'question' : 'article'} has been submitted successfully!`
        );
    }

    return (
        <main className="post-page">
            <section className="post-container">
                <h1 className="post-main-heading">New Post</h1>

                <form onSubmit={handleSubmit}>
                    <div className="post-type-row">
                        <span>Select Post Type:</span>

                        <label>
                            <input
                                type="radio"
                                name="postType"
                                value="question"
                                checked={postType === 'question'}
                                onChange={() => setPostType('question')}
                            />
                            Question
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="postType"
                                value="article"
                                checked={postType === 'article'}
                                onChange={() => setPostType('article')}
                            />
                            Article
                        </label>
                    </div>

                    <div className="post-section-heading">
                        What do you want to ask or share
                    </div>

                    <p className="post-instructions">
                        This section is designed based on the type of the post.
                        It could be developed by conditional rendering.
                    </p>

                    <div className="post-form-fields">
                        <div className="post-field-row">
                            <label htmlFor="postTitle">Title</label>

                            <input
                                id="postTitle"
                                type="text"
                                placeholder={
                                    postType === 'question'
                                        ? 'Start your question with how, what, why, etc.'
                                        : 'Enter a descriptive title'
                                }
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                minLength={5}
                                maxLength={150}
                                required
                            />
                        </div>

                        {postType === 'question' && (
                            <div className="post-field-column">
                                <label htmlFor="questionDescription">
                                    Describe your problem
                                </label>

                                <textarea
                                    id="questionDescription"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    minLength={20}
                                    required
                                />
                            </div>
                        )}

                        {postType === 'article' && (
                            <>
                                <div className="post-field-column">
                                    <label htmlFor="articleAbstract">Abstract</label>

                                    <textarea
                                        id="articleAbstract"
                                        placeholder="Enter a 1-paragraph abstract"
                                        value={abstract}
                                        onChange={(event) => setAbstract(event.target.value)}
                                        minLength={20}
                                        required
                                    />
                                </div>

                                <div className="post-field-column">
                                    <label htmlFor="articleText">Article Text</label>

                                    <textarea
                                        id="articleText"
                                        placeholder="Enter your article text"
                                        value={articleText}
                                        onChange={(event) => setArticleText(event.target.value)}
                                        minLength={50}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="post-field-row tags-row">
                            <label htmlFor="postTags">Tags</label>

                            <input
                                id="postTags"
                                type="text"
                                placeholder={
                                    postType === 'question'
                                        ? 'Please add up to 3 tags to describe your question, e.g., Java'
                                        : 'Please add up to 3 tags to describe your article, e.g., Java'
                                }
                                value={tags}
                                onChange={(event) => setTags(event.target.value)}
                            />
                        </div>

                        <div className="post-button-row">
                            <button type="submit">Post</button>
                        </div>
                    </div>
                </form>
            </section>
        </main>
    );


}

export default Post;
