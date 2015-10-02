steal("./content_list.js",
    "./frame_helper.js",
    "./versions.js",
    "./js/collapse.js",
    "./js/dropdown.js",
    "./styles/styles.less!",
    "./prettify", function(ContentList, FrameHelper, Versions){
        var codes = document.getElementsByTagName("code");
        for (var i = 0; i < codes.length; i++) {
            var code = codes[i];
            if (code.parentNode.nodeName.toUpperCase() === "PRE") {
                code.className = code.className + " prettyprint";
            }
        }
        prettyPrint();

        new ContentList(".contents");
        new FrameHelper(".docs");
        new Versions($("#versions, .sidebar-title:first"));


        $('textarea').click(function(){
            this.select();
        });

        if ($('.twitter-follow-button').length) {
            // replace the "Follow @canjs!" link with a little wiget with follower count.
            $('#twitter-wjs').remove();
            !function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (!d.getElementById(id)) {
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document, "script", "twitter-wjs");
        }

        $('.triptych .box').hover(function(){
            $(this).stop().animate({'background-position-y':'93%'}, 325);
        }, function(){
            $(this).stop().animate({'background-position-y':'90%'}, 325);
        }).click(function(event){
            var target = $(this).data('target');
            $('html, body').animate({
                scrollTop: $('#' + target).offset().top
            }, 500);

        });
        $('.triptych a').click(function(){
            event.stopPropagation();
        });


        $('.performance-row .donejs').hover(
            function(){
                var row = $('.performance-row');
                row.stop().animate({left: row.width() / 16}, 500);
                $('.donejs-text').stop().animate({opacity: 1}, 500);
                $('.naive-thumbs').stop().animate({opacity: 0.5}, 500);
            },
            function(){
                var row = $('.performance-row');
                row.stop().animate({left: 0}, 500);
                $('.donejs-text').stop().animate({opacity: 0}, 500);
                $('.naive-thumbs').stop().animate({opacity: 1}, 500);
            }
        );

        $('.performance-row .naive').hover(
            function(){
                var row = $('.performance-row');
                row.stop().animate({left: -(row.width() / 16)}, 500);
                $('.naive-text').stop().animate({opacity: 1}, 500);
                $('.donejs-thumbs').stop().animate({opacity: 0.5}, 500);

            },
            function(){
                var row = $('.performance-row');
                row.stop().animate({left: 0}, 500);
                $('.naive-text').stop().animate({opacity: 0}, 500);
                $('.donejs-thumbs').stop().animate({opacity: 1}, 500);
            }
        );
        $('video').hover(
            function(el){
                $(this).get(0).play();
                $(this).parent('div').addClass('playing');
            },
            function(el){
                $(this).get(0).pause();
                $(this).parent('div').removeClass('playing');
            }
        );

        $( ".usability-dl-options" ).hover(
            function () {
                $( this ).prev( ".btn" ).addClass( "active" );
            },
            function () {
                $( this ).prev( ".btn" ).removeClass( "active" );
            }
        );




        var getNavToHeaderEl = function ( hEl ) {
            var id = "";
            if ( hEl.length ) {
                id = hEl[ 0 ].id;
            } else if ( hEl.id ) {
                id = hEl.id;
            } else if ( typeof hEl === "string" ) {
                id = hEl;
            }
            if ( id.length === 0 ) {
                return $();
            }
            return $( "section.contents a[href*='" + id + "']" );
        };

        $( "section.comment h3" ).each(function(){
            //fix duplicate id problem
            var ids = $( '[id="' + this.id + '"]' );
            if( ids.length > 1 && ids[ 0 ] === this ) {
                var navTo = getNavToHeaderEl( ids );
                ids.each( function ( x, el ) {
                    var aEl = navTo.get( x );
                    aEl.href = aEl.href.replace( el.id, el.id + x );

                    el.id = el.id + x;
                });
            }
        });

        var activeH2Li = $();
        var doJQCollapsing = $( "body.Guide, body.place-my-order" ).length ? true : false;

        if ( doJQCollapsing ) {
            $( "section.contents ol ol" ).hide();
        }

        $(window).scroll(function () {
            var el = document.elementFromPoint( ~~( document.body.offsetWidth / 2 ), 250 );
            el = $( el ).closest( "section.comment > *" );
            if ( !el.length ) {
                return;
            }
            var h2 = el[ 0 ].tagName.toLowerCase() === "h2" ? el : el.prevAll( "h2:first" );
            var h3 = el[ 0 ].tagName.toLowerCase() === "h3" ? el : el.prevAll( "h3:first" );

            if ( !h2.length ) {
                return;
            }

            var navToH2 = getNavToHeaderEl( h2 ).closest( "li" );
            var navToH3 = navToH2.next( "ol" ).find( "li" ).has( getNavToHeaderEl( h3 ) );

            $( "section.contents ol ol li.active" ).not( navToH3 ).removeClass( "active" );
            navToH3.addClass( "active" );

            var curH2Li = navToH2.closest( "li" );
            if ( activeH2Li[ 0 ] !== curH2Li[ 0 ] ) {
                activeH2Li.removeClass( "active" );
                if ( doJQCollapsing ) activeH2Li.next( "ol" ).hide( 250 );

                activeH2Li = curH2Li;

                activeH2Li.addClass( "active" );
                if ( doJQCollapsing ) activeH2Li.next( "ol" ).show( 250 );
            }
        });


        //hijack guide page jumps, animate scroll
        $( function () {
            var clickFn = function () {
                var offset = -55;
                var thisLi = $( this ).closest( "li" );
                if ( thisLi.is( "body.Features ol > ol > li:first-child" ) ) {
                    offset = 222 - 50;
                }
                if ( thisLi.is( "body.Features ol > ol:first-of-type > li:first-child" ) ) {
                    offset = 222 - 65;
                }
                $( 'html, body' ).animate({
                    scrollTop: $( this.href.replace( /.*?#section=/, "#" ) ).offset().top + offset
                }, 500);
            };

            var hashOnLoad = window.location.hash;
            var jumpOnLoad = null;

            $( "section.contents a" ).each( function () {
                this.href = this.href.replace( "#", "#section=" );

                if ( hashOnLoad && this.href.replace( /.*?#section=/, "#section=" ) === hashOnLoad ) {
                    jumpOnLoad = this;
                }

                $( this ).on( "click", clickFn );

                return true;
            });

            if ( jumpOnLoad ) clickFn.call( jumpOnLoad );
        });




        var isMobileSize = false;
        var windowResize = function () {
            var width = $( window ).width();
            if ( width < 768 ) {
                isMobileSize = true;
            } else {
                isMobileSize = false;
            }
        };
        windowResize();
        $( window ).resize( windowResize );

        $( window ).scroll(function () {
            if ( !isMobileSize ) return;

            //.container-fluid > row > *
                //.usability.wrapper
                //.performance.wrapper
                //.maintainable.wrapper
                //.community.wrapper

            var el = document.elementFromPoint( ~~( document.body.offsetWidth / 2 ), 325 );
            el = $( el ).closest( ".container-fluid > .row > *" );
            if ( !el.length ) {
                return;
            }
            var curSect = el.is( ".usability.wrapper, .performance.wrapper, .maintainable.wrapper, .community.wrapper" );
            if ( curSect ) {
                curSect = el;
            } else {
                curSect = el.prevAll( ".usability.wrapper, .performance.wrapper, .maintainable.wrapper, .community.wrapper" ).eq( 0 );
            }

            if ( !curSect.length ) {
                //none are active and you're above usability.wrapper so un-fixed and un-condensed
                $( "body.donejs .overview-nav" ).removeClass( "fixed" );
                $( "body.donejs .overview-nav .overview-btn" ).removeClass( "condensed" ).removeClass( "active" );
            } else if ( curSect.is( ".usability.wrapper" ) ) {
                //fixed, condensed, usability is active
                $( "body.donejs .overview-nav" ).addClass( "fixed" );
                $( "body.donejs .overview-nav .overview-btn" ).addClass( "condensed" ).removeClass( "active" );
                $( "body.donejs .overview-nav .usability-btn" ).addClass( "active" );
            } else if ( curSect.is( ".performance.wrapper" ) ) {
                //fixed, condensed, performance is active
                $( "body.donejs .overview-nav" ).addClass( "fixed" );
                $( "body.donejs .overview-nav .overview-btn" ).addClass( "condensed" ).removeClass( "active" );
                $( "body.donejs .overview-nav .performance-btn" ).addClass( "active" );
            } else if ( curSect.is( ".maintainable.wrapper" ) ) {
                //fixed, condensed, maintainable is active
                $( "body.donejs .overview-nav" ).addClass( "fixed" );
                $( "body.donejs .overview-nav .overview-btn" ).addClass( "condensed" ).removeClass( "active" );
                $( "body.donejs .overview-nav .maintainable-btn" ).addClass( "active" );
            } else if ( curSect.is( ".community.wrapper" ) ) {
                //none are active but still is fixed and condensed
                $( "body.donejs .overview-nav" ).addClass( "fixed" );
                $( "body.donejs .overview-nav .overview-btn" ).addClass( "condensed" ).removeClass( "active" );
            }
        });
        //hijack home page page jumps, animate scroll
        $( function () {
            var clickFn = function () {
                var offset = -140;
                $( 'html, body' ).animate({
                    scrollTop: $( this.href.replace( /.*?#section=/, "#" ) ).offset().top + offset
                }, 500);
            };

            var hashOnLoad = window.location.hash;
            var jumpOnLoad = null;

            $( ".overview-nav a" ).each( function () {
                this.href = this.href.replace( "#", "#section=" );

                if ( hashOnLoad && this.href.replace( /.*?#section=/, "#section=" ) === hashOnLoad ) {
                    jumpOnLoad = this;
                }

                $( this ).on( "click", clickFn );

                return true;
            });

            if ( jumpOnLoad ) clickFn.call( jumpOnLoad );
        });
    });