import {extend} from 'flarum/extend';
import app from 'flarum/app';
import SessionDropdown from 'flarum/components/SessionDropdown';
import Button from 'flarum/components/Button';
import Page from 'flarum/components/Page';
import TagsPage from 'flarum/tags/components/TagsPage';
import IndexPage from 'flarum/components/IndexPage';

app.initializers.add('fof-nightmode', app => {
    extend(Page.prototype, 'init', function () {
        if (app.session.user && app.session.user.preferences().fofNightMode) {
            $('body').addClass('dark');
        } else if (!app.session.user && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            $('body').addClass('dark');
        } else {
            $('body').removeClass('dark');
        }
    });

    if (TagsPage) {
        extend(TagsPage.prototype, 'config', function () {
            if (app.session.user && app.session.user.preferences().fofNightMode) {
                $('body').addClass('dark');
            } else if (!app.session.user && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                $('body').addClass('dark');
            } else {
                $('body').removeClass('dark');
            }
        });
    }

    function addToItems(items,itemClassName='',className=''){
        let lightState = app.session.user.preferences().fofNightMode == true ? false : true;

        // Add night mode link to session dropdown
        items.add(app.session.user && app.session.user.preferences().fofNightMode ? 'nightmode' : 'daymode',
            Button.component({
                icon: lightState == true ? 'fas fa-moon' : 'fas fa-moon',
                href: 'javascript:;',
                children: lightState == true ? app.translator.trans('fof-nightmode.forum.night') : app.translator.trans('fof-nightmode.forum.day'),
                itemClassName,
                className,
                onclick: function () {
                    // Toggle night mode on or off by changing the user preference
                    app.session.user.savePreferences({'fofNightMode': lightState});

                    $('body').toggleClass('dark');
                }
            }),
            -1
        );
    }
    extend(SessionDropdown.prototype, 'items', function (items) {
        addToItems(items);
    });
    /* extend(IndexPage.prototype, 'sidebarItems', function (items) {
         addToItems(items,'App-PrimaryControl','Button Button--icon');
     });
 */
    extend(IndexPage.prototype, 'sidebarItems', function (items) {
        if (app.session.user) {
            addToItems(items, 'App-PrimaryControl', 'Button Button--icon');
        }
    });

});

