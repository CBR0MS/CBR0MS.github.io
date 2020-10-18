import React, { useState } from "react";
import { graphql } from "gatsby";
import Fade from "react-reveal/Fade";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostLink from "../components/PostLink";
import SEO from "../components/SEO";

import "../style/main.scss";

const uuidv4 = require("uuid/v4");

const Index = ({
    data: {
        allMarkdownRemark: { edges },
    },
}) => {
    const [loadedTags, setLoadedTags] = useState(false);
    const [tags, setTags] = useState(["everything"]);
    const [activeTags, setActiveTags] = useState("");

    if (!loadedTags) {
        let allTags = tags;
        edges.map((edge) => {
            const newTags = edge.node.frontmatter.tags.filter((tag) => {
                return !allTags.includes(tag);
            });
            allTags = allTags.concat(newTags);
            return false;
        });

        setTags(allTags);
        setLoadedTags(true);
        if (typeof window !== "undefined") {
            window.setTimeout(() => {
                setActiveTags("everything");
            }, 50);
        }
    }

    const tagButtons = tags.map((tag) => {
        // filtering and activation for multiple tags at a time
        // const setActive = tag =>
        //     setActiveTags(activeTags.filter(value => value !== tag));
        // const setInactive = tag => setActiveTags(activeTags.concat(tag));

        return (
            <div
                role="button"
                tabindex="0"
                className={`tag-button ${
                    activeTags.includes(tag) ? "enabled" : ""
                }`}
                key={uuidv4()}
                onClick={() => {
                    setActiveTags(tag);
                }}
                onKeyPress={(e) => {
                    if (e.key === "Enter") setActiveTags(tag);
                }}
            >
                {tag}
            </div>
        );
    });

    const goodEdges = edges.filter((edge) => {
        const includedTags = edge.node.frontmatter.tags.map((tag) => {
            return activeTags.includes(tag);
        });
        return includedTags.includes(true);
    });

    const posts = edges.map((edge, index) => (
        <PostLink
            key={edge.node.id}
            post={edge.node}
            pos={index}
            visible={
                activeTags.includes("everything") || goodEdges.includes(edge)
            }
        />
    ));

    return (
        <div style={{ overflow: "hidden" }}>
            <SEO title={`Projects - Christian Broms`} />
            <Navbar />
            <div style={{ minHeight: "100vh" }}>
                <Fade bottom distance="0px">
                    <div className="project-list-head outer">
                        <h1 className="project-list-head">
                            I create digital spaces that aim to be
                            understandable, well-structured, and resonant.
                        </h1>
                        <div className="project-head-tags">{tagButtons}</div>
                    </div>
                </Fade>
                <div className="project-list">
                    {posts}

                    <a
                        className="archived-projects"
                        href="https://archive.christianbroms.com"
                    >
                        See archived projects
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Index;

export const pageQuery = graphql`
    query {
        allMarkdownRemark(
            sort: { order: ASC, fields: [frontmatter___disp_order] }
        ) {
            edges {
                node {
                    id
                    frontmatter {
                        path
                        title
                        subtitle
                        tags
                        image {
                            childImageSharp {
                                fluid(maxWidth: 400) {
                                    ...GatsbyImageSharpFluid
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
